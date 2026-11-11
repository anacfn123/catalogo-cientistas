import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { buscarPorId, corDaArea } from '../services/cientistasService';
import { iniciais } from '../utils/iniciais';

export default function PerfilCientista() {
  const { id } = useParams();
  const [recarregar, setRecarregar] = useState(0);
  const [resultado, setResultado] = useState({ chave: '', cientista: undefined, erro: '' });
  const chave = `${id}:${recarregar}`;
  const cientista = resultado.chave === chave ? resultado.cientista : undefined;
  const erro = resultado.chave === chave ? resultado.erro : '';

  useEffect(() => {
    const controller = new AbortController();
    buscarPorId(id, controller.signal)
      .then((dados) => { if (!controller.signal.aborted) setResultado({ chave, cientista: dados, erro: '' }); })
      .catch((e) => { if (e.name !== 'AbortError' && !controller.signal.aborted) setResultado({ chave, cientista: undefined, erro: e.message }); });
    return () => controller.abort();
  }, [id, chave]);

  if (erro) return (
    <section className="pagina" role="alert">
      <h1>Erro ao carregar o perfil</h1><p>{erro}</p>
      <div className="acoes"><button type="button" className="btn btn-primario" onClick={() => setRecarregar((x) => x + 1)}>Tentar novamente</button>
      <Link to="/cientistas">Voltar ao catálogo</Link></div>
    </section>
  );
  if (cientista === undefined) return <section className="pagina"><p className="apoio" role="status">Carregando perfil...</p></section>;
  if (cientista === null) return <section className="pagina"><h1>Cientista não encontrada</h1><Link to="/cientistas">← Voltar para cientistas</Link></section>;

  const { nome, areas, anoInicio, anoFim, biografia, premios, contribuicoes, publicacoes } = cientista;
  const cor = corDaArea(areas[0]?.nome);

  return (
    <>
      <section className={`perfil cor-${cor}`}>
        <div className="avatar" aria-hidden="true">{iniciais(nome)}</div>
        <div className="perfil-info">
          <Link to="/cientistas">← Voltar para cientistas</Link>
          <h1>{nome}</h1>
          <p className="apoio">Início da atuação: {anoInicio}{anoFim ? ` · Término: ${anoFim}` : ''}</p>
          <div className="tags">
            {areas.map((a) => <span key={a.id} className={`tag tag-${corDaArea(a.nome)}`}>{a.nome}</span>)}
          </div>
        </div>
      </section>
      <div className="grade">
        <article className="card card-topo cor-azul"><h3>Trajetória</h3><p>{biografia}</p></article>
        <article className="card card-topo cor-rosa"><h3>Prêmios</h3>
          {premios.length === 0 ? <p className="apoio">Nenhum prêmio cadastrado.</p> : <ul>{premios.map((p) => <li key={p.id}>{p.nome} — {p.instituicao} ({p.ano})</li>)}</ul>}
        </article>
        <article className="card card-topo cor-verde"><h3>Contribuições</h3>
          {contribuicoes.length === 0 ? <p className="apoio">Nenhuma contribuição cadastrada.</p> : <ul>{contribuicoes.map((c) => <li key={c.id}>{c.impacto}: {c.descricao}</li>)}</ul>}
        </article>
        <article className="card card-topo cor-laranja"><h3>Publicações</h3>
          {publicacoes.length === 0 ? <p className="apoio">Nenhuma publicação cadastrada.</p> : <ul>{publicacoes.map((p) => <li key={p.id}>{p.titulo} — {p.veiculo} ({p.ano})</li>)}</ul>}
        </article>
      </div>
    </>
  );
}
