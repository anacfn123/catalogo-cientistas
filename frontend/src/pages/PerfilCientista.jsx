import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { buscarPorId, corDaArea } from '../services/cientistasService';
import { iniciais } from '../utils/iniciais';

export default function PerfilCientista() {
  const { id } = useParams();

  const [cientista, setCientista] = useState(undefined);

  useEffect(() => {
    buscarPorId(id).then(setCientista);
  }, [id]);

  if (cientista === undefined) {
    return <section className="pagina"><p className="apoio">Carregando...</p></section>;
  }

  if (cientista === null) {
    return (
      <section className="pagina">
        <h1>Cientista não encontrada</h1>
        <Link to="/cientistas">← Voltar para cientistas</Link>
      </section>
    );
  }

  const { nome, areas, anoInicio, anoFim, biografia, premios, contribuicoes } = cientista;
  const cor = corDaArea(areas[0]?.nome);

  return (
    <>
      <section className={`perfil cor-${cor}`}>
        <div className="avatar">{iniciais(nome)}</div>

        <div className="perfil-info">
          <Link to="/cientistas">← Voltar para cientistas</Link>
          <h1>{nome}</h1>
          <p className="apoio">{anoInicio} – {anoFim ?? 'atualmente'}</p>
          <div className="tags">
            {premios.map((p) => (
              <span key={p.id} className="tag tag-amarelo">{p.nome}</span>
            ))}
            {areas.map((a) => (
              <span key={a.id} className={`tag tag-${corDaArea(a.nome)}`}>{a.nome}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="grade">
        <article className="card card-topo cor-azul">
          <h3>Resumo</h3>
          <p>{biografia}</p>
        </article>
        <article className="card card-topo cor-rosa">
          <h3>Prêmios</h3>
          {premios.length === 0 ? (
            <p className="apoio">Nenhum prêmio cadastrado.</p>
          ) : (
            <ul>
              {premios.map((p) => (
                <li key={p.id}>{p.nome} ({p.ano})</li>
              ))}
            </ul>
          )}
        </article>
        <article className="card card-topo cor-verde">
          <h3>Importância</h3>
          {contribuicoes.length === 0 ? (
            <p className="apoio">Nenhuma contribuição cadastrada.</p>
          ) : (
            <ul>
              {contribuicoes.map((c) => (
                <li key={c.id}>{c.impacto}: {c.descricao}</li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </>
  );
}