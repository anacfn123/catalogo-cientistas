const pool = require('../config/db');

async function listar() {
  const [linhas] = await pool.query('SELECT id_area, nome_area FROM area ORDER BY nome_area');
  return linhas;
}

module.exports = { listar };
