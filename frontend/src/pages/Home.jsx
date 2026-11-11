import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { listar } from '../services/cientistasService';
import { Paisagem } from '../components/Decoracao';
import CampoBusca from '../components/CampoBusca';
import CientistaCard from '../components/CientistaCard';

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    listar({}, controller.signal)
      .then((lista) => setDestaques(lista.slice(0, 3)))
      .catch((e) => { if (e.name !== 'AbortError') setErro(e.message); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, []);

  const pesquisar = () => {
    navigate(`/cientistas${busca.trim() ? `?busca=${encodeURIComponent(busca.trim())}` : ''}`);
  };

  return (
    <>
      <section className="hero">
        <div>
          <h1>Brasileiras que fizeram ciência</h1>
          <p className="apoio">Pesquise cientistas, conheça suas trajetórias, prêmios e a importância do trabalho delas.</p>
          <CampoBusca valor={busca} aoMudar={setBusca} aoEnviar={pesquisar} />
        </div>
        <div><Paisagem /></div>
      </section>
      <section className="pagina"><h2>Cientistas em destaque</h2>
        {carregando && <p className="apoio" role="status">Carregando destaques...</p>}
        {erro && <p className="aviso-erro" role="alert">Não foi possível carregar os destaques: {erro}. <Link to="/cientistas">Ir para o catálogo</Link></p>}
      </section>
      {!erro && <div className="grade">{destaques.map((c) => <CientistaCard key={c.id} cientista={c} />)}</div>}
    </>
  );
}
