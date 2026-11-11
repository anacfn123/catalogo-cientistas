import { useState } from 'react';
import { Link } from 'react-router';
import { sugerir } from '../services/cientistasService';
import { Paisagem } from '../components/Decoracao';

const vazio = { nome: '', biografia: '', anoInicio: '', anoFim: '', nomeSolicitante: '', emailSolicitante: '' };

export default function SugerirCientista() {
  const [dados, setDados] = useState(vazio);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const mudar = (e) => {
    setDados((anteriores) => ({ ...anteriores, [e.target.name]: e.target.value }));
    setEnviado(false);
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErro('');
    try {
      await sugerir({ ...dados, anoFim: dados.anoFim === '' ? null : Number(dados.anoFim) });
      setDados(vazio);
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="hero">
      <div>
        <h1>Sugerir cientista</h1>
        <p className="apoio">Conhece uma cientista brasileira que deveria estar aqui? Envie os dados e a equipe vai analisar.</p>
        <form className="card" onSubmit={enviar}>
          <div className="campo-grupo"><label htmlFor="nome">Nome da cientista</label>
            <input id="nome" name="nome" className="campo" maxLength={150} value={dados.nome} onChange={mudar} required /></div>
          <div className="campo-grupo"><label htmlFor="biografia">Resumo da trajetória</label>
            <textarea id="biografia" name="biografia" className="campo" rows="4" value={dados.biografia} onChange={mudar} required /></div>
          <div className="campo-grupo"><label htmlFor="anoInicio">Ano em que começou a atuar</label>
            <input id="anoInicio" name="anoInicio" type="number" min="1901" max="2155" className="campo" value={dados.anoInicio} onChange={mudar} required /></div>
          <div className="campo-grupo"><label htmlFor="anoFim">Ano de término (opcional)</label>
            <input id="anoFim" name="anoFim" type="number" min="1901" max="2155" className="campo" value={dados.anoFim} onChange={mudar} /></div>
          <div className="campo-grupo"><label htmlFor="nomeSolicitante">Seu nome</label>
            <input id="nomeSolicitante" name="nomeSolicitante" className="campo" maxLength={150} value={dados.nomeSolicitante} onChange={mudar} required /></div>
          <div className="campo-grupo"><label htmlFor="emailSolicitante">Seu e-mail</label>
            <input id="emailSolicitante" name="emailSolicitante" type="email" className="campo" maxLength={150} value={dados.emailSolicitante} onChange={mudar} required /></div>
          <div className="acoes">
            <button type="submit" className="btn btn-destaque" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar sugestão'}</button>
            <Link to="/cientistas" className="btn btn-secundario">Cancelar</Link>
          </div>
          {enviado && <p className="tag tag-verde" role="status">Sugestão enviada para análise! Obrigada por contribuir.</p>}
          {erro && <p className="aviso-erro" role="alert">{erro}</p>}
        </form>
      </div>
      <div><Paisagem /></div>
    </section>
  );
}
