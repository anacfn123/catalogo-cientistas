import { Routes, Route } from 'react-router';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<h1>Catálogo de Cientistas</h1>}
      />
    </Routes>
  );
}

export default App;