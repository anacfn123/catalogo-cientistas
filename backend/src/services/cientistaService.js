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

// Ano válido para a coluna YEAR do MySQL (1901 até o ano atual).
function anoValido(ano) {
  const n = Number(ano);
  return Number.isInteger(n) && n >= 1901 && n <= new Date().getFullYear();
}

async function sugerir(corpo = {}) {
  // Tira espaços do começo/fim, para "   " contar como vazio.
  const limpar = (valor) => (typeof valor === 'string' ? valor.trim() : valor);
  const dados = {
    nome: limpar(corpo.nome),
    biografia: limpar(corpo.biografia),
    anoInicio: limpar(corpo.anoInicio),
    anoFim: limpar(corpo.anoFim),
    nomeSolicitante: limpar(corpo.nomeSolicitante),
    emailSolicitante: limpar(corpo.emailSolicitante),
  };

  const obrigatorios = ['nome', 'biografia', 'anoInicio', 'nomeSolicitante', 'emailSolicitante'];
  const faltando = obrigatorios.filter((campo) => !dados[campo]);
  if (faltando.length) throw erro(400, `Campos obrigatórios: ${faltando.join(', ')}`);

  // Limites de tamanho iguais aos do banco (VARCHAR(150)).
  if (dados.nome.length > 150) throw erro(400, 'Nome da cientista muito longo (máx. 150 caracteres)');
  if (dados.nomeSolicitante.length > 150) throw erro(400, 'Seu nome está muito longo (máx. 150 caracteres)');
  if (dados.emailSolicitante.length > 150) throw erro(400, 'E-mail muito longo (máx. 150 caracteres)');

  if (!/^\S+@\S+\.\S+$/.test(dados.emailSolicitante)) throw erro(400, 'E-mail inválido');

  if (!anoValido(dados.anoInicio)) throw erro(400, 'Ano de início inválido');
  if (dados.anoFim && (!anoValido(dados.anoFim) || Number(dados.anoFim) < Number(dados.anoInicio))) {
    throw erro(400, 'Ano de fim inválido');
  }

  const id = await repo.inserirSugestao(dados);
  return { id, status: 'pendente' };
}

module.exports = { listar, detalhar, sugerir };
