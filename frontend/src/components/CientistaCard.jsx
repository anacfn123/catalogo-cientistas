import { Link } from 'react-router-dom';
import { corDaArea } from '../services/cientistasService';
import { iniciais } from '../utils/iniciais';

export default function CientistaCard({ cientista }) {

  const { id, nome, areas, biografia } = cientista;
  const cor = corDaArea(areas[0]);

  return (
    <article className={`card cor-${cor}`}>
      <div className="card-cabecalho">
        <div className="avatar">{iniciais(nome)}</div>
        <div>
          <h3>{nome}</h3>
          <p className="apoio">{areas.join(', ')}</p>
        </div>
      </div>

      <p className="resumo">{biografia}</p>

      <div className="tags">
        {areas.map((area) => (
          <span key={area} className={`tag tag-${corDaArea(area)}`}>{area}</span>
        ))}
      </div>

      <Link to={`/cientistas/${id}`}>Ver perfil completo →</Link>
    </article>
  );
}