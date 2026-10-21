import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { listar } from '../services/cientistasService';
import { Paisagem } from '../components/Decoracao';
import CampoBusca from '../components/CampoBusca';
import CientistaCard from '../components/CientistaCard';

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listar().then((lista) => setDestaques(lista.slice(0, 3)));
  }, []);

  const pesquisar = () => {
    if (busca.trim() !== '') {
    navigate(`/cientistas?busca=${encodeURIComponent(busca)}`);
    }
  }

  return (
    <>
      <section className="hero">
        <div>
          <h1>Brasileiras que fizeram ciência</h1>
          <p className="apoio">
            Pesquise cientistas, conheça suas trajetórias, prêmios e a importância do trabalho delas.
          </p>
          <CampoBusca valor={busca} aoMudar={setBusca} aoEnviar={pesquisar} />
        </div>
        <div>
          <Paisagem />
        </div>
      </section>

      <section className="pagina">
        <h2>Cientistas em destaque</h2>
      </section>
      <div className="grade">
        {destaques.map((c) => (
          <CientistaCard key={c.id} cientista={c} />
        ))}
      </div>
    </>
  );
}