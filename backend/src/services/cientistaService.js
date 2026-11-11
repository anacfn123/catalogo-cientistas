// Regras e validações da API (independentes de HTTP e SQL).
const repo = require('../repositories/cientistaRepository');
const { cientistaResumoDto, cientistaDetalheDto, cientistaAdminDto } = require('../dtos/cientistaDto');

function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

function idValido(valor) {
  const id = Number(valor);
  if (!Number.isSafeInteger(id) || id < 1) throw erro(400, 'Identificador inválido.');
  return id;
}

function texto(valor, campo, max) {
  if (typeof valor !== 'string' || !valor.trim()) throw erro(400, `Campo obrigatório: ${campo}.`);
  const limpo = valor.trim();
  if (limpo.length > max) throw erro(400, `${campo} deve ter no máximo ${max} caracteres.`);
  return limpo;
}

function ano(valor, campo, opcional = false) {
  if (opcional && (valor === null || valor === undefined || valor === '')) return null;
  if (valor === null || valor === undefined || valor === '') throw erro(400, `Campo obrigatório: ${campo}.`);
  const n = Number(valor);
  if (!Number.isInteger(n) || n < 1901 || n > 2155) {
    throw erro(400, `${campo} deve estar entre 1901 e 2155.`);
  }
  return n;
}

function validarDados(dados, comAreas = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw erro(400, 'Envie um objeto JSON com os dados da cientista.');
  }
  const valor = {
    nome: texto(dados.nome, 'nome', 150),
    biografia: texto(dados.biografia, 'biografia', 65535),
    anoInicio: ano(dados.anoInicio, 'anoInicio'),
    anoFim: ano(dados.anoFim, 'anoFim', true),
  };
  if (valor.anoFim !== null && valor.anoFim < valor.anoInicio) {
    throw erro(400, 'anoFim não pode ser anterior a anoInicio.');
  }
  if (comAreas) {
    if (dados.areas !== undefined && !Array.isArray(dados.areas)) {
      throw erro(400, 'areas deve ser uma lista de identificadores.');
    }
    const ids = dados.areas ?? [];
    valor.areas = ids.map(idValido);
    if (new Set(valor.areas).size !== valor.areas.length) {
      throw erro(400, 'Não repita áreas de atuação.');
    }
  }
  return valor;
}

async function validarAreas(areas) {
  if (!areas.length) return;
  const encontradas = await repo.buscarIdsAreas(areas);
  if (encontradas.length !== areas.length) throw erro(400, 'Uma ou mais áreas não existem.');
}

async function listar(filtros = {}) {
  const areaId = filtros.areaId ? idValido(filtros.areaId) : undefined;
  const busca = filtros.busca ? String(filtros.busca).trim().slice(0, 150) : undefined;
  const linhas = await repo.listarAprovadas({ busca, areaId });
  return linhas.map(cientistaResumoDto);
}

async function detalhar(id) {
  const valido = idValido(id);
  const cientista = await repo.buscarAprovadaPorId(valido);
  if (!cientista) throw erro(404, 'Cientista não encontrada.');

  const [areas, premios, publicacoes, contribuicoes] = await Promise.all([
    repo.buscarAreas(valido), repo.buscarPremios(valido),
    repo.buscarPublicacoes(valido), repo.buscarContribuicoes(valido),
  ]);
  return cientistaDetalheDto(cientista, areas, premios, publicacoes, contribuicoes);
}

async function sugerir(dados) {
  const valido = validarDados(dados);
  const nomeSolicitante = texto(dados.nomeSolicitante, 'nomeSolicitante', 150);
  const emailSolicitante = texto(dados.emailSolicitante, 'emailSolicitante', 150);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSolicitante)) throw erro(400, 'E-mail inválido.');
  const id = await repo.inserirSugestao({ ...valido, nomeSolicitante, emailSolicitante });
  return { id, status: 'pendente' };
}

async function listarAdmin(status) {
  if (status && !['pendente', 'aprovada', 'rejeitada'].includes(status)) {
    throw erro(400, 'Filtro de status inválido.');
  }
  const linhas = await repo.listarAdmin(status);
  return linhas.map(cientistaAdminDto);
}

async function criar(dados) {
  const valido = validarDados(dados, true);
  await validarAreas(valido.areas);
  const id = await repo.criar(valido);
  return { id, status: 'aprovada' };
}

async function atualizar(id, dados) {
  const validoId = idValido(id);
  const valido = validarDados(dados, true);
  await validarAreas(valido.areas);
  if (!await repo.atualizar(validoId, valido)) throw erro(404, 'Cientista não encontrada.');
  return { id: validoId, mensagem: 'Cientista atualizada.' };
}

async function excluir(id) {
  const validoId = idValido(id);
  if (!await repo.excluir(validoId)) throw erro(404, 'Cientista não encontrada.');
  return { mensagem: 'Cientista excluída.' };
}

async function revisarSugestao(id, status) {
  const validoId = idValido(id);
  if (!['aprovada', 'rejeitada'].includes(status)) throw erro(400, 'Status deve ser aprovada ou rejeitada.');
  const resultado = await repo.alterarStatusPendente(validoId, status);
  if (resultado === 'nao_encontrada') throw erro(404, 'Sugestão não encontrada.');
  if (resultado === 'ja_analisada') throw erro(409, 'Esta sugestão já foi analisada.');
  return { id: validoId, status };
}

module.exports = {
  listar, detalhar, sugerir, listarAdmin, criar, atualizar, excluir, revisarSugestao,
};
