// Repository = único lugar que escreve SQL.
// Sempre usar "?" nos valores (nunca concatenar texto) para evitar SQL Injection.
const pool = require('../config/db');

async function listarAprovadas({ busca, areaId }) {
  let sql = `
    SELECT c.id_cientista, c.nome, c.biografia, c.ano_inicio_atuacao, c.ano_fim_atuacao,
           GROUP_CONCAT(a.nome_area ORDER BY a.nome_area SEPARATOR '|') AS areas
    FROM cientista c
    LEFT JOIN cientista_has_area ca ON ca.cientista_id_cientista = c.id_cientista
    LEFT JOIN area a ON a.id_area = ca.area_id_area
    WHERE c.status = 'aprovada'`;
  const params = [];

  if (busca) {
    sql += ' AND c.nome LIKE ?';
    params.push(`%${busca}%`);
  }
  if (areaId) {
    sql += ` AND c.id_cientista IN (
      SELECT cientista_id_cientista FROM cientista_has_area WHERE area_id_area = ?)`;
    params.push(areaId);
  }
  sql += ' GROUP BY c.id_cientista ORDER BY c.nome';

  const [linhas] = await pool.query(sql, params);
  return linhas;
}

async function buscarAprovadaPorId(id) {
  const [linhas] = await pool.query(
    "SELECT * FROM cientista WHERE id_cientista = ? AND status = 'aprovada'", [id]);
  return linhas[0]; // undefined se não achar
}

async function buscarAreas(id) {
  const [linhas] = await pool.query(
    `SELECT a.id_area, a.nome_area FROM area a
     JOIN cientista_has_area ca ON ca.area_id_area = a.id_area
     WHERE ca.cientista_id_cientista = ? ORDER BY a.nome_area`, [id]);
  return linhas;
}

async function buscarPremios(id) {
  const [linhas] = await pool.query(
    `SELECT p.id_premio, p.nome, p.instituicao_concedente, cp.ano FROM premio p
     JOIN cientista_has_premio cp ON cp.premio_id_premio = p.id_premio
     WHERE cp.cientista_id_cientista = ? ORDER BY cp.ano`, [id]);
  return linhas;
}

async function buscarPublicacoes(id) {
  const [linhas] = await pool.query(
    `SELECT p.id_publicacao, p.titulo, p.ano, p.veiculo FROM publicacoes p
     JOIN cientista_has_publicacoes cp ON cp.publicacoes_id_publicacao = p.id_publicacao
     WHERE cp.cientista_id_cientista = ? ORDER BY p.ano`, [id]);
  return linhas;
}

async function buscarContribuicoes(id) {
  const [linhas] = await pool.query(
    `SELECT c.id_contribuicao, c.impacto, c.descricao FROM contribuicoes c
     JOIN cientista_has_contribuicoes cc ON cc.contribuicoes_id_contribuicao = c.id_contribuicao
     WHERE cc.cientista_id_cientista = ?`, [id]);
  return linhas;
}

async function inserirSugestao(dados) {
  const [resultado] = await pool.query(
    `INSERT INTO cientista
       (nome, biografia, ano_inicio_atuacao, ano_fim_atuacao, nome_solicitante, email_solicitante, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pendente')`,
    [dados.nome, dados.biografia, dados.anoInicio, dados.anoFim || null,
      dados.nomeSolicitante, dados.emailSolicitante]);
  return resultado.insertId;
}

module.exports = {
  listarAprovadas, buscarAprovadaPorId, buscarAreas, buscarPremios,
  buscarPublicacoes, buscarContribuicoes, inserirSugestao,
};
