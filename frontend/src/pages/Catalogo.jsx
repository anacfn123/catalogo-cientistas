import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { listar, listarAreas } from '../services/cientistasService';
import CampoBusca from '../components/CampoBusca';
import CientistaCard from '../components/CientistaCard';

export default function Catalogo() {
  const [params] = useSearchParams();
  const [cientistas, setCientistas] = useState([]);
  const [busca, setBusca] = useState(params.get('busca') ?? '');
  const [area, setArea] = useState('Todas');
  const [listaAreas, setListaAreas] = useState([]);

  useEffect(() => {
    listar().then(setCientistas);
    listarAreas().then(setListaAreas);
  }, []);

  
  const texto = busca.toLowerCase();
  const filtradas = cientistas.filter(
    (c) =>
      (area === 'Todas' || c.areas.includes(area)) &&
      (c.nome.toLowerCase().includes(texto) || c.areas.some((a) => a.toLowerCase().includes(texto)))
  );

  return (
    <>
      <section className="pagina">
        <h1>Cientistas</h1>
        <CampoBusca valor={busca} aoMudar={setBusca} />
        <div className="tags">
          {['Todas', ...listaAreas.map((a) => a.nome)].map((nome) => (
            <button
              key={nome}
              className={`filtro ${area === nome ? 'ativo' : ''}`}
              onClick={() => setArea(nome)}
            >
              {nome}
            </button>
          ))}
        </div>
      </section>

      <div className="grade">
        {filtradas.map((c) => (
          <CientistaCard key={c.id} cientista={c} />
        ))}
      </div>
      {filtradas.length === 0 && <p className="apoio pagina">Nenhuma cientista encontrada.</p>}
    </>
  );
}