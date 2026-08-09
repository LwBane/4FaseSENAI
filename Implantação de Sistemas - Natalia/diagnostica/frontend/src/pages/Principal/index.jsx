import { useNavigate } from 'react-router-dom';

export default function Principal() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-agenda-bg">
      {/* Header */}
      <header className="bg-agenda-blue px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AgendaFácil" className="w-10 h-10 object-contain" />
          <h1 className="text-lg font-semibold text-white tracking-tight">
            AgendaFácil
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-4 py-1">
            <div className="w-7 h-7 rounded-full bg-agenda-teal flex items-center justify-center text-white text-xs font-semibold">
              {iniciais}
            </div>
            <span className="text-blue-100 text-sm">
              {usuario?.nome}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      {/* Faixa de saudação */}
      <div className="bg-gradient-to-r from-agenda-blue to-agenda-blue-dark px-6 py-10 text-center">
        <p className="text-blue-200 text-sm mb-1">{saudacao},</p>
        <h2 className="text-white text-3xl font-bold">
          {usuario?.nome?.split(' ')[0]} 
        </h2>
        <p className="text-blue-100 text-sm mt-2">
          O que você deseja fazer hoje?
        </p>
      </div>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto -mt-6 px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/cadastro-agendamento')}
            className="group bg-white shadow-lg rounded-2xl p-7 text-left hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border border-gray-100"
          >
            <div className="w-12 h-12 rounded-xl bg-agenda-teal/10 flex items-center justify-center mb-4 group-hover:bg-agenda-teal transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-agenda-teal group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2v4M8 2v4M3 10h18M12 15v3M10.5 16.5h3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-agenda-blue mb-1.5">
              Cadastro de Agendamento
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Criar, editar, buscar e excluir agendamentos de faxina.
            </p>
            <span className="inline-flex items-center gap-1 text-agenda-teal text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <button
            onClick={() => navigate('/gestao-agendamentos')}
            className="group bg-white shadow-lg rounded-2xl p-7 text-left hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border border-gray-100"
          >
            <div className="w-12 h-12 rounded-xl bg-agenda-blue/10 flex items-center justify-center mb-4 group-hover:bg-agenda-blue transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-agenda-blue group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-agenda-blue mb-1.5">
              Gestão de Agendamentos
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Organizar horários, realocar profissionais e evitar conflitos.
            </p>
            <span className="inline-flex items-center gap-1 text-agenda-blue text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}