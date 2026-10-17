// DTO = formato dos dados que a API devolve para o frontend.
// Aqui convertemos a linha do banco (nomes de coluna) para um objeto limpo,
// e escondemos dados internos (ex.: e-mail de quem sugeriu).

function cientistaResumoDto(linha) {
  return {
    id: linha.id_cientista,
    nome: linha.nome,
    anoInicio: linha.ano_inicio_atuacao,
    anoFim: linha.ano_fim_atuacao,
    areas: linha.areas ? linha.areas.split('|') : [],
  };
}

function cientistaDetalheDto(linha, areas, premios, publicacoes, contribuicoes) {
  return {
    id: linha.id_cientista,
    nome: linha.nome,
    biografia: linha.biografia,
    anoInicio: linha.ano_inicio_atuacao,
    anoFim: linha.ano_fim_atuacao,
    areas: areas.map((a) => ({ id: a.id_area, nome: a.nome_area })),
    premios: premios.map((p) => ({
      id: p.id_premio, nome: p.nome, instituicao: p.instituicao_concedente, ano: p.ano,
    })),
    publicacoes: publicacoes.map((p) => ({
      id: p.id_publicacao, titulo: p.titulo, ano: p.ano, veiculo: p.veiculo,
    })),
    contribuicoes: contribuicoes.map((c) => ({
      id: c.id_contribuicao, impacto: c.impacto, descricao: c.descricao,
    })),
  };
}

module.exports = { cientistaResumoDto, cientistaDetalheDto };
