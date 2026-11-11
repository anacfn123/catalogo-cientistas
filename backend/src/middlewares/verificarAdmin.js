// Autenticação simples para o protótipo acadêmico. O segredo fica APENAS no backend.
const { createHash, timingSafeEqual } = require('node:crypto');

function verificarAdmin(req, res, next) {
  const segredo = process.env.ADMIN_TOKEN;
  if (!segredo || segredo.length < 16) {
    return res.status(503).json({ erro: 'Admin não configurado. Defina ADMIN_TOKEN (mínimo 16 caracteres) no backend.' });
  }

  const cabecalho = req.get('authorization') || '';
  const encontrado = /^Bearer (.+)$/i.exec(cabecalho);
  if (!encontrado) return res.status(401).json({ erro: 'Credencial administrativa necessária.' });

  const hash = (valor) => createHash('sha256').update(valor).digest();
  if (!timingSafeEqual(hash(encontrado[1]), hash(segredo))) {
    return res.status(401).json({ erro: 'Credencial administrativa inválida.' });
  }
  next();
}

module.exports = verificarAdmin;
