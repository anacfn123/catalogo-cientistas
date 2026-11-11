const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Transforma apenas os exports ESM e o valor de import.meta.env para executar a camada
// de comunicação HTTP em isolamento, sem dependências instaladas.
const fonte = fs.readFileSync(path.join(__dirname, '../src/services/cientistasService.js'), 'utf8')
  .replace('import.meta.env.VITE_API_URL', "'http://localhost:3000/api'")
  .replace(/^export /gm, '');

function iniciar(fetch) {
  const contexto = { module: { exports: {} }, fetch, URLSearchParams, Error };
  vm.runInNewContext(`${fonte}\nmodule.exports = {
    listar, listarAreas, buscarPorId, sugerir, verificarSessaoAdmin, listarAdmin,
    listarPendentes, cadastrarCientista, editarCientista, excluirCientista, analisarSugestao,
  };`, contexto);
  return contexto.module.exports;
}

const resposta = (status, corpo) => ({ ok: status >= 200 && status < 300, status, json: async () => corpo });

test('busca pública monta query por nome e área', async () => {
  let url;
  const api = iniciar(async (caminho) => { url = caminho; return resposta(200, [{ id: 1 }]); });
  const resultado = await api.listar({ busca: 'Ana Maria', area: '7' });
  assert.equal(url, 'http://localhost:3000/api/cientistas?busca=Ana+Maria&area=7');
  assert.equal(resultado[0].id, 1);
});

test('perfil ausente retorna null, mas erro do backend não vira 404', async () => {
  let api = iniciar(async () => resposta(404, { erro: 'Não encontrada' }));
  assert.equal(await api.buscarPorId(5), null);
  api = iniciar(async () => resposta(500, { erro: 'Falha interna' }));
  await assert.rejects(api.buscarPorId(5), /Falha interna/);
});

test('sugestão é enviada por POST JSON', async () => {
  let url, opcoes;
  const api = iniciar(async (u, o) => { url = u; opcoes = o; return resposta(201, { id: 2, status: 'pendente' }); });
  const retorno = await api.sugerir({ nome: 'Ana' });
  assert.equal(url, 'http://localhost:3000/api/sugestoes');
  assert.equal(opcoes.method, 'POST');
  assert.equal(JSON.parse(opcoes.body).nome, 'Ana');
  assert.equal(retorno.status, 'pendente');
});

test('CRUD do admin usa credencial e métodos HTTP corretos', async () => {
  const chamadas = [];
  const api = iniciar(async (u, o) => {
    chamadas.push({ url: u, options: o });
    return resposta(200, { ok: true });
  });
  await api.verificarSessaoAdmin('segredo');
  await api.listarAdmin('segredo');
  await api.listarPendentes('segredo');
  await api.cadastrarCientista('segredo', { nome: 'Ana' });
  await api.editarCientista('segredo', 3, { nome: 'Ana Maria' });
  await api.excluirCientista('segredo', 3);
  await api.analisarSugestao('segredo', 4, 'aprovada');
  assert.deepEqual(chamadas.map((chamada) => [chamada.options.method, chamada.url.replace('http://localhost:3000/api', '')]), [
    ['GET', '/admin/sessao'], ['GET', '/admin/cientistas'], ['GET', '/admin/sugestoes'],
    ['POST', '/admin/cientistas'], ['PUT', '/admin/cientistas/3'], ['DELETE', '/admin/cientistas/3'],
    ['PATCH', '/admin/sugestoes/4'],
  ]);
  assert.ok(chamadas.every((chamada) => chamada.options.headers.Authorization === 'Bearer segredo'));
  assert.equal(JSON.parse(chamadas[6].options.body).status, 'aprovada');
});

test('API retorna erro de credencial e erro de rede legíveis', async () => {
  let api = iniciar(async () => resposta(401, { erro: 'Token inválido' }));
  await assert.rejects(api.listarAdmin('ruim'), (e) => e.status === 401 && e.message === 'Token inválido');
  api = iniciar(async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(api.listar(), /Não foi possível conectar à API/);
});
