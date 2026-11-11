import { Routes, Route } from 'react-router';
import Home from '../pages/Home';
import Catalogo from '../pages/Catalogo';
import PerfilCientista from '../pages/PerfilCientista';
import SugerirCientista from '../pages/SugerirCientista';
import Sobre from '../pages/Sobre';
import Admin from '../pages/Admin';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cientistas" element={<Catalogo />} />
      <Route path="/cientistas/:id" element={<PerfilCientista />} />
      <Route path="/sugerir" element={<SugerirCientista />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<section className="pagina"><h1>Página não encontrada</h1><p>Confira o endereço e tente novamente.</p></section>} />
    </Routes>
  );
}