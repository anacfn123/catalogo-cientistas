// Middleware que captura qualquer erro e responde em JSON.
// (O Express 5 já manda para cá os erros das funções async.)
function tratarErros(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ erro: status === 500 ? 'Erro interno no servidor' : err.message });
}

module.exports = tratarErros;
