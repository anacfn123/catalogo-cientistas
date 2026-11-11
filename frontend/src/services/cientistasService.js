const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const coresDasAreas = {
  Biologia: 'verde', Agronomia: 'laranja', Genética: 'rosa',
  Medicina: 'azul', Botânica: 'verde',
};

export const corDaArea = (area) => coresDasAreas[area] ?? 'azul';

async function chamar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API}${caminho}`, opcoes);
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Não foi possível conectar à API. Confira se o backend está ligado.');
  }
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const erro = new Error(corpo.erro || `Erro na requisição (${resposta.status}).`);
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}

export function listar({ busca = '', area = '' } = {}, signal) {
  const query = new URLSearchParams();
  if (busca.trim()) query.set('busca', busca.trim());
  if (area) query.set('area', area);
  const qs = query.toString();
  return chamar(`/cientistas${qs ? `?${qs}` : ''}`, { signal });
}

export const listarAreas = (signal) => chamar('/areas', { signal });

export async function buscarPorId(id, signal) {
  try {
    return await chamar(`/cientistas/${encodeURIComponent(id)}`, { signal });
  } catch (erro) {
    if (erro.status === 404) return null;
    throw erro;
  }
}

export const sugerir = (dados) => chamar('/sugestoes', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados),
});

function admin(caminho, token, { method = 'GET', body } = {}) {
  return chamar(`/admin${caminho}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

export const verificarSessaoAdmin = (token) => admin('/sessao', token);
export const listarAdmin = (token) => admin('/cientistas', token);
export const listarPendentes = (token) => admin('/sugestoes', token);
export const cadastrarCientista = (token, dados) => admin('/cientistas', token, { method: 'POST', body: dados });
export const editarCientista = (token, id, dados) => admin(`/cientistas/${id}`, token, { method: 'PUT', body: dados });
export const excluirCientista = (token, id) => admin(`/cientistas/${id}`, token, { method: 'DELETE' });
export const analisarSugestao = (token, id, status) => admin(`/sugestoes/${id}`, token, { method: 'PATCH', body: { status } });
