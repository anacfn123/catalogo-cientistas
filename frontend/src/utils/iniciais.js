// Iniciais do avatar: primeira letra da primeira e da última palavra do nome.
export function iniciais(nome) {
  const palavras = nome.replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return '?';
  const ultima = palavras.length > 1 ? palavras[palavras.length - 1][0] : '';
  return (palavras[0][0] + ultima).toUpperCase();
}