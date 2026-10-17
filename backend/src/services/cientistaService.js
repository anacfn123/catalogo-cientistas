// Service = regras do sistema. Não sabe nada de SQL nem de HTTP.
const repo = require('../repositories/cientistaRepository');
const { cientistaResumoDto, cientistaDetalheDto } = require('../dtos/cientistaDto');

// Erro com código HTTP, para o controller/middleware saber o que responder.
function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

async function listar(filtros) {
  const linhas = await repo.listarAprovadas(filtros);
  return linhas.map(cientistaResumoDto);
}

async function detalhar(id) {
  const cientista = await repo.buscarAprovadaPorId(id);
  if (!cientista) throw erro(404, 'Cientista não encontrada');

  const [areas, premios, publicacoes, contribuicoes] = await Promise.all([
    repo.buscarAreas(id), repo.buscarPremios(id),
    repo.buscarPublicacoes(id), repo.buscarContribuicoes(id),
  ]);
  return cientistaDetalheDto(cientista, areas, premios, publicacoes, contribuicoes);
}

async function sugerir(dados) {
  const obrigatorios = ['nome', 'biografia', 'anoInicio', 'nomeSolicitante', 'emailSolicitante'];
  const faltando = obrigatorios.filter((campo) => !dados[campo]);
  if (faltando.length) throw erro(400, `Campos obrigatórios: ${faltando.join(', ')}`);

  if (!/^\S+@\S+\.\S+$/.test(dados.emailSolicitante)) throw erro(400, 'E-mail inválido');

  const id = await repo.inserirSugestao(dados);
  return { id, status: 'pendente' };
}

module.exports = { listar, detalhar, sugerir };
