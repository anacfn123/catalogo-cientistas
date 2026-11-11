import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { listar, listarAreas } from '../services/cientistasService';
import CampoBusca from '../components/CampoBusca';
import CientistaCard from '../components/CientistaCard';

function BuscaCatalogo({ buscaAtiva, aoBuscar }) {
  const [texto, setTexto] = useState(buscaAtiva);
  return <CampoBusca valor={texto} aoMudar={setTexto} aoEnviar={() => aoBuscar(texto)} />;
}

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const buscaAtiva = params.get('busca') || '';
  const areaAtiva = params.get('area') || '';
  const [areas, setAreas] = useState([]);
  const [erroAreas, setErroAreas] = useState('');
  const [recarregar, setRecarregar] = useState(0);
  const [consulta, setConsulta] = useState({ chave: null, cientistas: [], erro: '' });
  const chave = JSON.stringify([buscaAtiva, areaAtiva, recarregar]);
  const carregando = consulta.chave !== chave;
  const cientistas = carregando ? [] : consulta.cientistas;
  const erro = carregando ? '' : consulta.erro;

  useEffect(() => {
    const controller = new AbortController();
    listarAreas(controller.signal).then(setAreas).catch((e) => {
      if (e.name !== 'AbortError') setErroAreas(e.message);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    listar({ busca: buscaAtiva, area: areaAtiva }, controller.signal)
      .then((lista) => { if (!controller.signal.aborted) setConsulta({ chave, cientistas: lista, erro: '' }); })
      .catch((e) => { if (e.name !== 'AbortError' && !controller.signal.aborted) setConsulta({ chave, cientistas: [], erro: e.message }); });
    return () => controller.abort();
  }, [buscaAtiva, areaAtiva, chave]);

  const aplicarFiltros = (busca, area) => {
    const proximos = new URLSearchParams();
    if (busca.trim()) proximos.set('busca', busca.trim());
    if (area) proximos.set('area', area);
    setParams(proximos);
  };

  return (
    <>
      <section className="pagina">
        <h1>Cientistas</h1>
        <p className="apoio">Explore trajetórias e filtre por nome ou área de atuação.</p>
        <BuscaCatalogo key={buscaAtiva} buscaAtiva={buscaAtiva} aoBuscar={(texto) => aplicarFiltros(texto, areaAtiva)} />
        {erroAreas && <p role="alert" className="aviso-erro">Não foi possível carregar os filtros: {erroAreas}</p>}
        <div className="tags" aria-label="Filtrar por área">
          <button type="button" className={`filtro ${!areaAtiva ? 'ativo' : ''}`} aria-pressed={!areaAtiva}
            onClick={() => aplicarFiltros(buscaAtiva, '')}>Todas</button>
          {areas.map((area) => (
            <button type="button" key={area.id} className={`filtro ${areaAtiva === String(area.id) ? 'ativo' : ''}`}
              aria-pressed={areaAtiva === String(area.id)}
              onClick={() => aplicarFiltros(buscaAtiva, String(area.id))}>{area.nome}</button>
          ))}
        </div>
      </section>
      {carregando && <p className="pagina apoio" role="status">Carregando cientistas...</p>}
      {!carregando && erro && (
        <section className="pagina" role="alert">
          <p className="aviso-erro">{erro}</p>
          <button className="btn btn-primario" type="button" onClick={() => setRecarregar((x) => x + 1)}>Tentar novamente</button>
        </section>
      )}
      {!carregando && !erro && <>
        <p className="contador-resultados">{cientistas.length} {cientistas.length === 1 ? 'cientista encontrada' : 'cientistas encontradas'}</p>
        <div className="grade">
          {cientistas.map((c) => <CientistaCard key={c.id} cientista={c} />)}
        </div>
        {cientistas.length === 0 && <p className="pagina apoio">Nenhuma cientista encontrada. Tente outra busca ou filtro.</p>}
      </>}
    </>
  );
}
