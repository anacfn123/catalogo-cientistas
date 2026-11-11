import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  verificarSessaoAdmin, listarAdmin, listarPendentes, listarAreas,
  cadastrarCientista, editarCientista, excluirCientista, analisarSugestao,
} from '../services/cientistasService';

const camposVazios = { nome: '', biografia: '', anoInicio: '', anoFim: '', areas: [] };
const nomeStatus = { aprovada: 'Aprovada', rejeitada: 'Rejeitada', pendente: 'Pendente' };

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [segredo, setSegredo] = useState('');
  const [aba, setAba] = useState('cientistas');
  const [cientistas, setCientistas] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(camposVazios);
  const [idEdicao, setIdEdicao] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  function sair(mensagemErro = '') {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setSegredo('');
    setCientistas([]);
    setPendentes([]);
    setFormAberto(false);
    setErro(mensagemErro);
    setMensagem('');
  }

  async function carregar(credencial) {
    setCarregando(true);
    try {
      const [lista, sugestoes, listaAreas] = await Promise.all([
        listarAdmin(credencial), listarPendentes(credencial), listarAreas(),
      ]);
      setCientistas(lista);
      setPendentes(sugestoes);
      setAreas(listaAreas);
    } catch (e) {
      if (e.status === 401) sair('Acesso expirado ou credencial inválida. Entre novamente.');
      else setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (token) carregar(token);
    // carregar consulta todos os recursos ao entrar; alterações são recarregadas após cada ação.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setOcupado(true);
    try {
      await verificarSessaoAdmin(segredo.trim());
      sessionStorage.setItem('adminToken', segredo.trim());
      setToken(segredo.trim());
      setSegredo('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  function novo() {
    setIdEdicao(null);
    setForm({ ...camposVazios, areas: [] });
    setFormAberto(true);
    setErro('');
    setMensagem('');
    setAba('cientistas');
  }

  function editar(cientista) {
    setIdEdicao(cientista.id);
    setForm({
      nome: cientista.nome,
      biografia: cientista.biografia,
      anoInicio: String(cientista.anoInicio ?? ''),
      anoFim: String(cientista.anoFim ?? ''),
      areas: [...cientista.areas],
    });
    setFormAberto(true);
    setErro('');
    setMensagem('');
    setAba('cientistas');
  }

  function alternarArea(id, marcado) {
    setForm((anterior) => ({
      ...anterior,
      areas: marcado ? [...anterior.areas, id] : anterior.areas.filter((atual) => atual !== id),
    }));
  }

  async function salvar(e) {
    e.preventDefault();
    setOcupado(true);
    setErro('');
    setMensagem('');
    try {
      const dados = {
        ...form,
        anoInicio: Number(form.anoInicio),
        anoFim: form.anoFim === '' ? null : Number(form.anoFim),
      };
      if (idEdicao === null) await cadastrarCientista(token, dados);
      else await editarCientista(token, idEdicao, dados);
      setFormAberto(false);
      setMensagem(idEdicao === null ? 'Cientista cadastrada com sucesso.' : 'Cientista atualizada com sucesso.');
      await carregar(token);
    } catch (e) {
      if (e.status === 401) sair('Credencial inválida. Entre novamente.');
      else setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  async function excluir(cientista) {
    if (!window.confirm(`Deseja excluir definitivamente ${cientista.nome}?`)) return;
    setOcupado(true);
    setErro('');
    setMensagem('');
    try {
      await excluirCientista(token, cientista.id);
      if (idEdicao === cientista.id) setFormAberto(false);
      setMensagem(`${cientista.nome} foi excluída.`);
      await carregar(token);
    } catch (e) {
      if (e.status === 401) sair('Credencial inválida. Entre novamente.');
      else setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  async function avaliar(cientista, status) {
    const acao = status === 'aprovada' ? 'aprovar' : 'recusar';
    if (!window.confirm(`Deseja ${acao} a sugestão de ${cientista.nome}?`)) return;
    setOcupado(true);
    setErro('');
    setMensagem('');
    try {
      await analisarSugestao(token, cientista.id, status);
      setMensagem(`Sugestão de ${cientista.nome} ${status === 'aprovada' ? 'aprovada' : 'recusada'}.`);
      await carregar(token);
    } catch (e) {
      if (e.status === 401) sair('Credencial inválida. Entre novamente.');
      else setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  if (!token) return (
    <section className="pagina admin-pagina">
      <Link to="/">← Voltar ao início</Link>
      <h1>Administração</h1>
      <p className="apoio">Acesso exclusivo à equipe responsável pelo catálogo. Informe o token configurado no backend.</p>
      <form className="card admin-login" onSubmit={entrar}>
        <div className="campo-grupo"><label htmlFor="token-admin">Token de administrador</label>
          <input id="token-admin" type="password" autoComplete="off" className="campo" value={segredo}
            onChange={(e) => setSegredo(e.target.value)} required /></div>
        <button className="btn btn-primario" type="submit" disabled={ocupado}>{ocupado ? 'Verificando...' : 'Entrar'}</button>
        {erro && <p role="alert" className="aviso-erro">{erro}</p>}
      </form>
    </section>
  );

  return (
    <section className="pagina admin-pagina">
      <div className="admin-cabecalho">
        <div><h1>Administração</h1><p className="apoio">Gerencie cientistas e analise as sugestões recebidas.</p></div>
        <button type="button" className="btn btn-secundario" onClick={() => sair()}>Sair</button>
      </div>
      <div className="admin-navegacao" role="group" aria-label="Áreas da administração">
        <button type="button" className={`filtro ${aba === 'cientistas' ? 'ativo' : ''}`} aria-pressed={aba === 'cientistas'} onClick={() => setAba('cientistas')}>Cientistas ({cientistas.length})</button>
        <button type="button" className={`filtro ${aba === 'sugestoes' ? 'ativo' : ''}`} aria-pressed={aba === 'sugestoes'} onClick={() => setAba('sugestoes')}>Sugestões pendentes ({pendentes.length})</button>
        <button type="button" className="filtro" onClick={() => { setErro(''); carregar(token); }} disabled={carregando}>Atualizar listas</button>
      </div>
      {erro && <p role="alert" className="aviso-erro">{erro}</p>}
      {mensagem && <p role="status" className="aviso-sucesso">{mensagem}</p>}
      {carregando && <p role="status" className="apoio">Atualizando dados...</p>}

      {aba === 'cientistas' && <>
        <div className="acoes"><button type="button" className="btn btn-destaque" onClick={novo} disabled={ocupado}>+ Cadastrar cientista</button></div>
        {formAberto && <form className="card admin-form" onSubmit={salvar}>
          <h2>{idEdicao === null ? 'Cadastrar cientista' : 'Editar cientista'}</h2>
          <div className="campo-grupo"><label htmlFor="admin-nome">Nome</label>
            <input id="admin-nome" className="campo" maxLength={150} required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="campo-grupo"><label htmlFor="admin-biografia">Biografia</label>
            <textarea id="admin-biografia" className="campo" rows="5" required value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} /></div>
          <div className="admin-anos">
            <div className="campo-grupo"><label htmlFor="admin-inicio">Ano de início</label>
              <input id="admin-inicio" type="number" min="1901" max="2155" className="campo" required value={form.anoInicio} onChange={(e) => setForm({ ...form, anoInicio: e.target.value })} /></div>
            <div className="campo-grupo"><label htmlFor="admin-fim">Ano de término (opcional)</label>
              <input id="admin-fim" type="number" min="1901" max="2155" className="campo" value={form.anoFim} onChange={(e) => setForm({ ...form, anoFim: e.target.value })} /></div>
          </div>
          <fieldset className="admin-areas"><legend>Áreas de atuação</legend><div className="tags">
            {areas.map((area) => <label key={area.id} className="admin-opcao"><input type="checkbox" checked={form.areas.includes(area.id)} onChange={(e) => alternarArea(area.id, e.target.checked)} />{area.nome}</label>)}
            {areas.length === 0 && <p className="apoio">Nenhuma área carregada.</p>}
          </div></fieldset>
          <div className="acoes">
            <button type="submit" className="btn btn-primario" disabled={ocupado || carregando}>{ocupado ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" className="btn btn-secundario" onClick={() => setFormAberto(false)} disabled={ocupado}>Cancelar</button>
          </div>
        </form>}
        <div className="admin-lista">
          {cientistas.map((cientista) => <article className="card admin-item" key={cientista.id}>
            <div className="admin-item-texto">
              <h3>{cientista.nome}</h3>
              <span className={`tag tag-${cientista.status === 'aprovada' ? 'verde' : cientista.status === 'pendente' ? 'amarelo' : 'rosa'}`}>{nomeStatus[cientista.status]}</span>
              <p className="apoio">{cientista.anoInicio}{cientista.anoFim ? `–${cientista.anoFim}` : ''} · {cientista.areas.map((id) => areas.find((area) => area.id === id)?.nome).filter(Boolean).join(', ') || 'Sem área informada'}</p>
            </div>
            <div className="acoes">
              <button type="button" className="btn btn-primario" onClick={() => editar(cientista)} disabled={ocupado}>Editar</button>
              <button type="button" className="btn btn-perigo" onClick={() => excluir(cientista)} disabled={ocupado}>Excluir</button>
            </div>
          </article>)}
          {!carregando && cientistas.length === 0 && <p className="apoio">Nenhuma cientista cadastrada.</p>}
        </div>
      </>}

      {aba === 'sugestoes' && <div className="admin-lista">
        {pendentes.map((cientista) => <article className="card admin-item" key={cientista.id}>
          <div className="admin-item-texto">
            <h3>{cientista.nome}</h3>
            <p>{cientista.biografia}</p>
            <p className="apoio">Atuação a partir de {cientista.anoInicio}{cientista.anoFim ? ` até ${cientista.anoFim}` : ''}</p>
            <p className="apoio">Sugerida por: {cientista.nomeSolicitante || 'Não informado'} ({cientista.emailSolicitante || 'Sem e-mail'})</p>
          </div>
          <div className="acoes">
            <button type="button" className="btn btn-primario" onClick={() => avaliar(cientista, 'aprovada')} disabled={ocupado}>Aprovar</button>
            <button type="button" className="btn btn-perigo" onClick={() => avaliar(cientista, 'rejeitada')} disabled={ocupado}>Recusar</button>
            <button type="button" className="btn btn-secundario" onClick={() => editar(cientista)} disabled={ocupado}>Editar dados</button>
          </div>
        </article>)}
        {!carregando && pendentes.length === 0 && <p className="apoio">Nenhuma sugestão pendente.</p>}
      </div>}
    </section>
  );
}
