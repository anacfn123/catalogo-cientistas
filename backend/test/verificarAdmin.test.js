const test = require('node:test');
const assert = require('node:assert/strict');
const verificarAdmin = require('../src/middlewares/verificarAdmin');
const antigo = process.env.ADMIN_TOKEN;

test.after(() => {
  if (antigo === undefined) delete process.env.ADMIN_TOKEN;
  else process.env.ADMIN_TOKEN = antigo;
});

function executar(autorizacao) {
  let status = 200, resposta, proximo = false;
  const req = { get: () => autorizacao };
  const res = {
    status(novo) { status = novo; return this; },
    json(dados) { resposta = dados; return this; },
  };
  verificarAdmin(req, res, () => { proximo = true; });
  return { status, resposta, proximo };
}

test('sem configuração o painel não opera', () => {
  delete process.env.ADMIN_TOKEN;
  assert.equal(executar('').status, 503);
});

test('sem token ou token inválido o acesso é bloqueado', () => {
  process.env.ADMIN_TOKEN = 'segredo-12345678901234567890';
  assert.equal(executar('').status, 401);
  assert.equal(executar('Bearer invalido').status, 401);
});

test('token correto concede acesso', () => {
  process.env.ADMIN_TOKEN = 'segredo-12345678901234567890';
  const resultado = executar('Bearer segredo-12345678901234567890');
  assert.equal(resultado.proximo, true);
  assert.equal(resultado.status, 200);
});
