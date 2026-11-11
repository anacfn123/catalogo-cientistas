// Smoke test real da API. Necessita backend, MySQL e dados iniciais configurados.
// Executar: node --env-file=.env test/fluxoE2E.mjs
import assert from 'node:assert/strict';

const apiUrl = (process.env.API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const token = process.env.ADMIN_TOKEN;
if (!token || token.length < 16) {
  console.error('Configure ADMIN_TOKEN no .env antes de executar este teste.');
  process.exit(2);
}

async function chamar(caminho, { method = 'GET', body, admin = false, esperado = 200 } = {}) {
  const resposta = await fetch(`${apiUrl}${caminho}`, {
    method,
    headers: {
      ...(admin ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const dados = await resposta.json();
  assert.equal(resposta.status, esperado, `${method} ${caminho}: esperado ${esperado}, obteve ${resposta.status}: ${JSON.stringify(dados)}`);
  return dados;
}

const idsCriados = [];
const unico = `${Date.now()}`;
const exemplo = {
  nome: `Cientista teste E2E ${unico}`,
  biografia: 'Cientista temporária criada para validar o fluxo da API.',
  anoInicio: 2001,
  anoFim: null,
};

try {
  const saude = await chamar('/health');
  assert.equal(saude.banco, 'ok');
  const areas = await chamar('/areas');
  assert.ok(Array.isArray(areas));

  const criada = await chamar('/admin/cientistas', {
    method: 'POST', admin: true, esperado: 201,
    body: { ...exemplo, areas: areas.length ? [areas[0].id] : [] },
  });
  idsCriados.push(criada.id);
  assert.equal(criada.status, 'aprovada');
  const atualizado = await chamar(`/admin/cientistas/${criada.id}`, {
    method: 'PUT', admin: true,
    body: { ...exemplo, nome: `${exemplo.nome} atualizado`, areas: [] },
  });
  assert.equal(atualizado.id, criada.id);
  const listagem = await chamar(`/cientistas?busca=${encodeURIComponent(`E2E ${unico}`)}`);
  assert.ok(listagem.some((c) => c.id === criada.id));
  const perfil = await chamar(`/cientistas/${criada.id}`);
  assert.match(perfil.nome, /atualizado/);
  assert.ok(Array.isArray(perfil.publicacoes));
  await chamar(`/admin/cientistas/${criada.id}`, { method: 'DELETE', admin: true });
  idsCriados.splice(idsCriados.indexOf(criada.id), 1);
  await chamar(`/cientistas/${criada.id}`, { esperado: 404 });

  const sugestao = (sufixo) => ({ ...exemplo, nome: `${exemplo.nome} sugestão ${sufixo}`,
    nomeSolicitante: 'Teste automatizado', emailSolicitante: 'teste@example.com' });

  const aprovar = await chamar('/sugestoes', { method: 'POST', esperado: 201, body: sugestao('aprovar') });
  idsCriados.push(aprovar.id);
  const pendentes = await chamar('/admin/sugestoes', { admin: true });
  assert.ok(pendentes.some((c) => c.id === aprovar.id));
  await chamar(`/cientistas/${aprovar.id}`, { esperado: 404 });
  const aprovada = await chamar(`/admin/sugestoes/${aprovar.id}`, {
    method: 'PATCH', admin: true, body: { status: 'aprovada' },
  });
  assert.equal(aprovada.status, 'aprovada');
  await chamar(`/cientistas/${aprovar.id}`);
  await chamar(`/admin/sugestoes/${aprovar.id}`, { method: 'PATCH', admin: true,
    body: { status: 'rejeitada' }, esperado: 409 });

  const recusar = await chamar('/sugestoes', { method: 'POST', esperado: 201, body: sugestao('recusar') });
  idsCriados.push(recusar.id);
  const rejeitada = await chamar(`/admin/sugestoes/${recusar.id}`, {
    method: 'PATCH', admin: true, body: { status: 'rejeitada' },
  });
  assert.equal(rejeitada.status, 'rejeitada');
  await chamar(`/cientistas/${recusar.id}`, { esperado: 404 });

  await chamar('/admin/cientistas', { esperado: 401 });
  console.log('PASSOU: health, áreas, CRUD, busca, perfil, sugestões, aprovação, recusa, conflito e autenticação.');
} catch (erro) {
  console.error('FALHOU:', erro.message);
  process.exitCode = 1;
} finally {
  for (const id of idsCriados) {
    try {
      await chamar(`/admin/cientistas/${id}`, { method: 'DELETE', admin: true });
    } catch (erro) {
      console.error(`ATENÇÃO: limpar manualmente o registro de teste ${id}: ${erro.message}`);
      process.exitCode = 1;
    }
  }
}
