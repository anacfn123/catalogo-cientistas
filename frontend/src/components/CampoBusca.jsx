export default function CampoBusca({ valor, aoMudar, aoEnviar }) {
  const enviar = (e) => {
    e.preventDefault();
    aoEnviar?.();
  };

  return (
    <form className="busca" onSubmit={enviar}>
      <input
        className="campo"
        type="text"
        aria-label="Buscar cientista"
        placeholder="Busque por nome ou área"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
      />
      {aoEnviar && (
        <button className="btn btn-primario" type="submit">Pesquisar</button>
      )}
    </form>
  );
}