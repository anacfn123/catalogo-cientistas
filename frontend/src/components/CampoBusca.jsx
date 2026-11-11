export default function CampoBusca({ valor, aoMudar, aoEnviar }) {
  const enviar = (e) => {
    e.preventDefault();
    aoEnviar?.();
  };

  return (
    <form className="busca" onSubmit={enviar}>
      <input
        className="campo"
        type="search"
        aria-label="Buscar cientista"
        placeholder="Busque por nome ou área"
        maxLength={150}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
      />
      {aoEnviar && (
        <button className="btn btn-primario" type="submit">Pesquisar</button>
      )}
    </form>
  );
}