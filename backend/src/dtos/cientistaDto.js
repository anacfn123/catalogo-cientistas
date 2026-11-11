// DTO: evita expor dados de solicitantes nas rotas públicas.
function cientistaResumoDto(linha) {
  return {
    id: linha.id_cientista,
    nome: linha.nome,
    biografia: linha.biografia,
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

function cientistaAdminDto(linha) {
  return {
    id: linha.id_cientista,
    nome: linha.nome,
    biografia: linha.biografia,
    anoInicio: linha.ano_inicio_atuacao,
    anoFim: linha.ano_fim_atuacao,
    areas: linha.areas_ids ? linha.areas_ids.split(',').map(Number) : [],
    nomeSolicitante: linha.nome_solicitante,
    emailSolicitante: linha.email_solicitante,
    status: linha.status,
  };
}

module.exports = { cientistaResumoDto, cientistaDetalheDto, cientistaAdminDto };
