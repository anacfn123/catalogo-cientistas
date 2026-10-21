import { useState } from 'react';
import { Link } from 'react-router';
import { sugerir } from '../services/cientistasService';
import { Paisagem } from '../components/Decoracao';

const vazio = { nome: '', biografia: '', anoInicio: '', nomeSolicitante: '', emailSolicitante: '' };

export default function SugerirCientista() {
  const [dados, setDados] = useState(vazio);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const mudar = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      await sugerir(dados);
      setDados(vazio);
      setEnviado(true);
      setErro('');
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <section className="hero">
      <div>
        <h1>Sugerir cientista</h1>
        <p className="apoio">
          Conhece uma cientista brasileira que deveria estar aqui? Envie os dados e a equipe vai analisar.
        </p>

        <form className="card" onSubmit={enviar}>
          <div className="campo-grupo">
            <label htmlFor="nome">Nome da cientista</label>
            <input id="nome" name="nome" className="campo" value={dados.nome} onChange={mudar} required />
          </div>

          <div className="campo-grupo">
            <label htmlFor="biografia">Resumo da trajetória</label>
            <textarea id="biografia" name="biografia" className="campo" rows="4" value={dados.biografia} onChange={mudar} required />
          </div>

          <div className="campo-grupo">
            <label htmlFor="anoInicio">Ano em que começou a atuar</label>
            <input id="anoInicio" name="anoInicio" type="number" className="campo" value={dados.anoInicio} onChange={mudar} required />
          </div>

          <div className="campo-grupo">
            <label htmlFor="nomeSolicitante">Seu nome</label>
            <input id="nomeSolicitante" name="nomeSolicitante" className="campo" value={dados.nomeSolicitante} onChange={mudar} required />
          </div>

          <div className="campo-grupo">
            <label htmlFor="emailSolicitante">Seu e-mail</label>
            <input id="emailSolicitante" name="emailSolicitante" type="email" className="campo" value={dados.emailSolicitante} onChange={mudar} required />
          </div>

          <div className="acoes">
            <button type="submit" className="btn btn-destaque">Enviar sugestão</button>
            <Link to="/cientistas" className="btn btn-secundario">Cancelar</Link>
          </div>

          {enviado && <p className="tag tag-verde" role="status">Sugestão enviada! Obrigada por contribuir.</p>}
          {erro && <p className="tag tag-rosa" role="alert">{erro}</p>}

        </form>
      </div>

      <div>
        <Paisagem />
      </div>
    </section>
  );
}