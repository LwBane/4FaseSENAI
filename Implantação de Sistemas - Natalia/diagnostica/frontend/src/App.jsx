import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Principal from './pages/Principal';
import CadastroAgendamento from './pages/CadastroAgendamento';
import GestaoAgendamentos from './pages/GestaoAgendamentos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/cadastro-agendamento" element={<CadastroAgendamento />} />
        <Route path="/gestao-agendamentos" element={<GestaoAgendamentos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;