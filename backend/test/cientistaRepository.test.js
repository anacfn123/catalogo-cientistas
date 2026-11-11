const test = require('node:test');
const assert = require('node:assert/strict');
const caminhoDb = require.resolve('../src/config/db');
const db = { query: async () => [[]], getConnection: async () => {} };
require.cache[caminhoDb] = { id: caminhoDb, filename: caminhoDb, loaded: true, exports: db };
const repo = require('../src/repositories/cientistaRepository');

test('consulta pública filtra aprovadas, nome, área por texto e por ID sem interpolar dados', async () => {
  let sql, params;
  db.query = async (s, p) => { sql = s; params = p; return [[]]; };
  await repo.listarAprovadas({ busca: "'; DROP TABLE cientista; --", areaId: 3 });
  assert.match(sql, /c\.status = 'aprovada'/);
  assert.match(sql, /ab\.nome_area LIKE \?/);
  assert.match(sql, /LEFT\(c\.biografia, 240\)/);
  assert.match(sql, /area_id_area = \?/);
  assert.equal(params.length, 3);
  assert.equal(params[0], "%'; DROP TABLE cientista; --%");
  assert.equal(params[2], 3);
  assert.equal(sql.includes('DROP TABLE'), false);
});

test('listagem administrativa filtra pendentes com parâmetro SQL', async () => {
  let sql, params;
  db.query = async (s, p) => { sql = s; params = p; return [[]]; };
  await repo.listarAdmin('pendente');
  assert.match(sql, /WHERE c\.status = \?/);
  assert.deepEqual(params, ['pendente']);
});

test('aprovação condicionada a pendente; reanálise resulta em conflito', async () => {
  const consultas = [];
  db.query = async (sql, params) => {
    consultas.push([sql, params]);
    if (sql.startsWith('UPDATE')) return [{ affectedRows: 0 }];
    return [[{ status: 'aprovada' }]];
  };
  assert.equal(await repo.alterarStatusPendente(5, 'rejeitada'), 'ja_analisada');
  assert.match(consultas[0][0], /status = 'pendente'/);
  assert.deepEqual(consultas[0][1], ['rejeitada', 5]);
  db.query = async (sql) => sql.startsWith('UPDATE') ? [{ affectedRows: 1 }] : [[]];
  assert.equal(await repo.alterarStatusPendente(5, 'aprovada'), 'alterado');
  db.query = async (sql) => sql.startsWith('UPDATE') ? [{ affectedRows: 0 }] : [[]];
  assert.equal(await repo.alterarStatusPendente(5, 'aprovada'), 'nao_encontrada');
});

function transacaoMock(respostaUpdate) {
  const chamadas = [];
  const conexao = {
    beginTransaction: async () => chamadas.push('BEGIN'),
    commit: async () => chamadas.push('COMMIT'),
    rollback: async () => chamadas.push('ROLLBACK'),
    release: () => chamadas.push('RELEASE'),
    query: async (sql, params) => {
      chamadas.push([sql, params]);
      if (sql.startsWith('INSERT INTO cientista ')) return [{ insertId: 25 }];
      if (sql.startsWith('UPDATE cientista ') || sql.startsWith('DELETE FROM cientista WHERE')) {
        return [{ affectedRows: respostaUpdate }];
      }
      return [{ affectedRows: 1 }];
    },
  };
  db.getConnection = async () => conexao;
  return chamadas;
}

test('cadastro salva áreas na mesma transação', async () => {
  const chamadas = transacaoMock(1);
  assert.equal(await repo.criar({ nome: 'Ana', biografia: 'Bio', anoInicio: 2000, anoFim: null, areas: [1, 2] }), 25);
  assert.equal(chamadas.filter((c) => Array.isArray(c) && c[0].startsWith('INSERT INTO cientista_has_area')).length, 2);
  assert.ok(chamadas.includes('COMMIT'));
  assert.ok(chamadas.includes('RELEASE'));
});

test('edição substitui áreas e faz rollback para ID ausente', async () => {
  const dados = { nome: 'Ana', biografia: 'Bio', anoInicio: 2000, anoFim: null, areas: [3] };
  let chamadas = transacaoMock(1);
  assert.equal(await repo.atualizar(3, dados), true);
  assert.ok(chamadas.some((c) => Array.isArray(c) && c[0].startsWith('DELETE FROM cientista_has_area')));
  assert.ok(chamadas.includes('COMMIT'));
  chamadas = transacaoMock(0);
  assert.equal(await repo.atualizar(400, dados), false);
  assert.ok(chamadas.includes('ROLLBACK'));
  assert.equal(chamadas.includes('COMMIT'), false);
});

test('exclusão remove relações previamente, respeitando chaves estrangeiras', async () => {
  const chamadas = transacaoMock(1);
  assert.equal(await repo.excluir(9), true);
  const comandos = chamadas.filter(Array.isArray).map((v) => v[0]);
  assert.ok(comandos.indexOf('DELETE FROM cientista WHERE id_cientista = ?') > comandos.indexOf('DELETE FROM cientista_has_contribuicoes WHERE cientista_id_cientista = ?'));
  assert.ok(chamadas.includes('COMMIT'));
});
