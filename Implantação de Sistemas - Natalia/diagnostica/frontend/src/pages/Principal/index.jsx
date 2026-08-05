import { useNavigate } from 'react-router-dom';

export default function Principal() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-agenda-bg">
      {/* Header */}
      <header className="bg-agenda-blue shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AgendaFácil" className="w-10 h-10 object-contain" />
          <h1 className="text-lg font-semibold text-white">
            AgendaFácil
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-agenda-blue-light text-sm">
            Olá, <span className="font-medium text-white">{usuario?.nome}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-agenda-teal hover:bg-agenda-teal-dark text-white text-sm font-medium px-4 py-2 rounded-md transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-semibold text-agenda-blue mb-8 text-center">
          O que você deseja fazer?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/cadastro-agendamento')}
            className="bg-white shadow-md rounded-lg p-8 text-left hover:shadow-lg transition border border-transparent hover:border-agenda-teal"
          >
            <h3 className="text-lg font-semibold text-agenda-blue mb-2">
              Cadastro de Agendamento
            </h3>
            <p className="text-gray-500 text-sm">
              Criar, editar, buscar e excluir agendamentos.
            </p>
          </button>

          <button
            onClick={() => navigate('/gestao-agendamentos')}
            className="bg-white shadow-md rounded-lg p-8 text-left hover:shadow-lg transition border border-transparent hover:border-agenda-teal"
          >
            <h3 className="text-lg font-semibold text-agenda-blue mb-2">
              Gestão de Agendamentos
            </h3>
            <p className="text-gray-500 text-sm">
              Organizar horários, profissionais e conflitos.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}