const API = import.meta.env.VITE_API_URL;

const coresDasAreas = {
  Biologia: 'verde',
  Agronomia: 'laranja',
  Genética: 'rosa',
  Medicina: 'azul',
  Botânica: 'verde',
};

export const corDaArea = (area) => coresDasAreas[area] ?? 'azul';

async function chamar(caminho, opcoes) {
  const resposta = await fetch(`${API}${caminho}`, opcoes);
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.erro ?? 'Erro ao falar com o servidor');
  return corpo;
}

export const listar = () => chamar('/cientistas');

export const listarAreas = () => chamar('/areas');

export async function buscarPorId(id) {
  const resposta = await fetch(`${API}/cientistas/${id}`);
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error('Erro ao carregar a cientista');
  return resposta.json();
}

export const sugerir = (dados) =>
  chamar('/sugestoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });