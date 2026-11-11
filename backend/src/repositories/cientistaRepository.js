// Consultas SQL parametrizadas: valores de usuários nunca são interpolados no SQL.
const pool = require('../config/db');

async function listarAprovadas({ busca, areaId } = {}) {
  let sql = `
    SELECT c.id_cientista, c.nome, LEFT(c.biografia, 240) AS biografia,
           c.ano_inicio_atuacao, c.ano_fim_atuacao,
           GROUP_CONCAT(a.nome_area ORDER BY a.nome_area SEPARATOR '|') AS areas
    FROM cientista c
    LEFT JOIN cientista_has_area ca ON ca.cientista_id_cientista = c.id_cientista
    LEFT JOIN area a ON a.id_area = ca.area_id_area
    WHERE c.status = 'aprovada'`;
  const params = [];

  if (busca) {
    sql += ' AND (c.nome LIKE ? OR EXISTS (SELECT 1 FROM cientista_has_area cb JOIN area ab ON ab.id_area = cb.area_id_area WHERE cb.cientista_id_cientista = c.id_cientista AND ab.nome_area LIKE ?))';
    params.push(`%${busca}%`, `%${busca}%`);
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
  return linhas[0];
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
    [dados.nome, dados.biografia, dados.anoInicio, dados.anoFim,
      dados.nomeSolicitante, dados.emailSolicitante]);
  return resultado.insertId;
}

async function listarAdmin(status) {
  let sql = `SELECT c.*, (
    SELECT GROUP_CONCAT(ca.area_id_area ORDER BY ca.area_id_area SEPARATOR ',')
    FROM cientista_has_area ca WHERE ca.cientista_id_cientista = c.id_cientista
  ) AS areas_ids FROM cientista c`;
  const parametros = [];
  if (status) {
    sql += ' WHERE c.status = ?';
    parametros.push(status);
  }
  sql += ' ORDER BY c.nome';
  const [linhas] = await pool.query(sql, parametros);
  return linhas;
}

async function buscarIdsAreas(ids) {
  if (!ids.length) return [];
  const [linhas] = await pool.query(
    `SELECT id_area FROM area WHERE id_area IN (${ids.map(() => '?').join(',')})`, ids);
  return linhas.map((area) => area.id_area);
}

async function salvarAreas(conexao, id, areas) {
  await conexao.query('DELETE FROM cientista_has_area WHERE cientista_id_cientista = ?', [id]);
  for (const idArea of areas) {
    await conexao.query(
      'INSERT INTO cientista_has_area (cientista_id_cientista, area_id_area) VALUES (?, ?)',
      [id, idArea]);
  }
}

async function criar(dados) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [resultado] = await conexao.query(
      `INSERT INTO cientista (nome, biografia, ano_inicio_atuacao, ano_fim_atuacao, status)
       VALUES (?, ?, ?, ?, 'aprovada')`,
      [dados.nome, dados.biografia, dados.anoInicio, dados.anoFim]);
    await salvarAreas(conexao, resultado.insertId, dados.areas);
    await conexao.commit();
    return resultado.insertId;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function atualizar(id, dados) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [resultado] = await conexao.query(
      `UPDATE cientista SET nome = ?, biografia = ?, ano_inicio_atuacao = ?, ano_fim_atuacao = ?
       WHERE id_cientista = ?`,
      [dados.nome, dados.biografia, dados.anoInicio, dados.anoFim, id]);
    if (!resultado.affectedRows) {
      await conexao.rollback();
      return false;
    }
    await salvarAreas(conexao, id, dados.areas);
    await conexao.commit();
    return true;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function excluir(id) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    // Exclusão das relações antes da entidade, pois o schema não define ON DELETE CASCADE.
    for (const tabela of [
      'cientista_has_area', 'cientista_has_premio',
      'cientista_has_publicacoes', 'cientista_has_contribuicoes',
    ]) {
      await conexao.query(`DELETE FROM ${tabela} WHERE cientista_id_cientista = ?`, [id]);
    }
    const [resultado] = await conexao.query('DELETE FROM cientista WHERE id_cientista = ?', [id]);
    if (!resultado.affectedRows) {
      await conexao.rollback();
      return false;
    }
    await conexao.commit();
    return true;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function alterarStatusPendente(id, status) {
  const [resultado] = await pool.query(
    "UPDATE cientista SET status = ? WHERE id_cientista = ? AND status = 'pendente'",
    [status, id]);
  if (resultado.affectedRows) return 'alterado';
  const [linhas] = await pool.query('SELECT status FROM cientista WHERE id_cientista = ?', [id]);
  return linhas.length ? 'ja_analisada' : 'nao_encontrada';
}

module.exports = {
  listarAprovadas, buscarAprovadaPorId, buscarAreas, buscarPremios,
  buscarPublicacoes, buscarContribuicoes, inserirSugestao,
  listarAdmin, buscarIdsAreas, criar, atualizar, excluir, alterarStatusPendente,
};
