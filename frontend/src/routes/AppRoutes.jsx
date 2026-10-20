import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Catalogo from '../pages/Catalogo';
import PerfilCientista from '../pages/PerfilCientista';
import SugerirCientista from '../pages/SugerirCientista';
import Sobre from '../pages/Sobre';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cientistas" element={<Catalogo />} />
      <Route path="/cientistas/:id" element={<PerfilCientista />} />
      <Route path="/sugerir" element={<SugerirCientista />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  );
}