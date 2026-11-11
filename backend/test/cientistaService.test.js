const test = require('node:test');
const assert = require('node:assert/strict');

// Mock do repositório: testes das regras sem depender de um servidor MySQL.
const caminhoRepo = require.resolve('../src/repositories/cientistaRepository');
const repo = {};
require.cache[caminhoRepo] = { id: caminhoRepo, filename: caminhoRepo, loaded: true, exports: repo };
const service = require('../src/services/cientistaService');

const exemplo = {
  nome: 'Cientista Exemplo', biografia: 'Trajetória científica importante',
  anoInicio: 1995, anoFim: null, areas: [1, 2],
};

test.beforeEach(() => {
  Object.keys(repo).forEach((key) => delete repo[key]);
  Object.assign(repo, {
    buscarIdsAreas: async () => [1, 2],
    criar: async () => 42,
    atualizar: async () => true,
    excluir: async () => true,
    alterarStatusPendente: async () => 'alterado',
    inserirSugestao: async () => 17,
    listarAprovadas: async () => [],
    listarAdmin: async () => [],
    buscarAprovadaPorId: async () => null,
    buscarAreas: async () => [], buscarPremios: async () => [],
    buscarPublicacoes: async () => [], buscarContribuicoes: async () => [],
  });
});

test('cadastra aprovada e encaminha áreas validadas', async () => {
  let recebido;
  repo.criar = async (dados) => { recebido = dados; return 42; };
  assert.deepEqual(await service.criar(exemplo), { id: 42, status: 'aprovada' });
  assert.deepEqual(recebido.areas, [1, 2]);
  assert.equal(recebido.anoFim, null);
});

test('não cadastra com área inexistente, repetida ou campo inválido', async () => {
  repo.buscarIdsAreas = async () => [1];
  await assert.rejects(service.criar(exemplo), { status: 400 });
  await assert.rejects(service.criar({ ...exemplo, areas: [1, 1] }), { status: 400 });
  await assert.rejects(service.criar({ ...exemplo, nome: '  ' }), { status: 400 });
  await assert.rejects(service.criar({ ...exemplo, anoInicio: 1800 }), { status: 400 });
  await assert.rejects(service.criar({ ...exemplo, anoFim: 1990 }), { status: 400 });
  await assert.rejects(service.criar({ ...exemplo, areas: 'invalido' }), { status: 400 });
});

test('edita e retorna 404 quando o registro não existe', async () => {
  assert.deepEqual(await service.atualizar('10', exemplo), { id: 10, mensagem: 'Cientista atualizada.' });
  repo.atualizar = async () => false;
  await assert.rejects(service.atualizar('10', exemplo), { status: 404 });
  await assert.rejects(service.atualizar('abc', exemplo), { status: 400 });
});

test('exclui e retorna erros adequados', async () => {
  assert.deepEqual(await service.excluir('7'), { mensagem: 'Cientista excluída.' });
  repo.excluir = async () => false;
  await assert.rejects(service.excluir('7'), { status: 404 });
  await assert.rejects(service.excluir('-1'), { status: 400 });
});

test('sugestões são criadas como pendentes e exigem e-mail válido', async () => {
  const dados = { ...exemplo, nomeSolicitante: 'Visitante', emailSolicitante: 'a@b.com' };
  let recebido;
  repo.inserirSugestao = async (item) => { recebido = item; return 17; };
  assert.deepEqual(await service.sugerir(dados), { id: 17, status: 'pendente' });
  assert.equal(recebido.emailSolicitante, 'a@b.com');
  await assert.rejects(service.sugerir({ ...dados, emailSolicitante: 'invalido' }), { status: 400 });
  await assert.rejects(service.sugerir(null), { status: 400 });
});

test('aprovação e recusa usam só status permitidos e bloqueiam reanálise', async () => {
  assert.deepEqual(await service.revisarSugestao('8', 'aprovada'), { id: 8, status: 'aprovada' });
  assert.deepEqual(await service.revisarSugestao('8', 'rejeitada'), { id: 8, status: 'rejeitada' });
  await assert.rejects(service.revisarSugestao('8', 'pendente'), { status: 400 });
  repo.alterarStatusPendente = async () => 'ja_analisada';
  await assert.rejects(service.revisarSugestao('8', 'aprovada'), { status: 409 });
  repo.alterarStatusPendente = async () => 'nao_encontrada';
  await assert.rejects(service.revisarSugestao('8', 'aprovada'), { status: 404 });
});

test('listagem pública devolve apenas dados públicos e busca parametrizada', async () => {
  let filtro;
  repo.listarAprovadas = async (dados) => {
    filtro = dados;
    return [{ id_cientista: 2, nome: 'Ana', biografia: 'Biografia', ano_inicio_atuacao: 1990,
      ano_fim_atuacao: null, areas: 'Biologia|Genética', email_solicitante: 'privado@x.com' }];
  };
  const lista = await service.listar({ busca: 'Ana', areaId: '1' });
  assert.deepEqual(filtro, { busca: 'Ana', areaId: 1 });
  assert.equal(lista[0].biografia, 'Biografia');
  assert.deepEqual(lista[0].areas, ['Biologia', 'Genética']);
  assert.equal('emailSolicitante' in lista[0], false);
  await assert.rejects(service.listar({ areaId: 'nao-e-numero' }), { status: 400 });
});

test('perfil só permite registros aprovados e inclui publicações', async () => {
  await assert.rejects(service.detalhar('9'), { status: 404 });
  repo.buscarAprovadaPorId = async () => ({ id_cientista: 9, nome: 'Ana', biografia: 'Bio',
    ano_inicio_atuacao: 1991, ano_fim_atuacao: null, email_solicitante: 'privado@x.com' });
  repo.buscarPublicacoes = async () => [{ id_publicacao: 12, titulo: 'Artigo', ano: 2005, veiculo: 'Revista' }];
  const perfil = await service.detalhar('9');
  assert.equal(perfil.publicacoes[0].titulo, 'Artigo');
  assert.equal('emailSolicitante' in perfil, false);
});

test('admin lista status e dados do solicitante, restringe filtros inválidos', async () => {
  let status;
  repo.listarAdmin = async (filtro) => {
    status = filtro;
    return [{ id_cientista: 1, nome: 'Ana', biografia: 'Bio', ano_inicio_atuacao: 1991,
      ano_fim_atuacao: null, areas_ids: '2,3', nome_solicitante: 'Fulana',
      email_solicitante: 'a@b.com', status: 'pendente' }];
  };
  const resultado = await service.listarAdmin('pendente');
  assert.equal(status, 'pendente');
  assert.deepEqual(resultado[0].areas, [2, 3]);
  assert.equal(resultado[0].emailSolicitante, 'a@b.com');
  await assert.rejects(service.listarAdmin('invalido'), { status: 400 });
});
