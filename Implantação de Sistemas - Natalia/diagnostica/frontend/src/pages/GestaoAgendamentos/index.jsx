import { useNavigate } from 'react-router-dom';

export default function GestaoAgendamentos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate('/principal')}
        className="text-blue-500 hover:underline mb-6"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-semibold text-gray-800">
        Gestão de Agendamentos
      </h2>
      <p className="text-gray-500 mt-2">Em construção...</p>
    </div>
  );
}