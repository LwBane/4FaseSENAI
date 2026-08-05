import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const res = await axios.post('http://localhost:3000/api/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/principal');
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Erro ao tentar fazer login.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-agenda-bg p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Lado da marca */}
        <div className="md:w-1/2 bg-gradient-to-br from-agenda-blue to-agenda-blue-dark flex flex-col items-center justify-center p-10 text-center">
          <img
            src="/logo.png"
            alt="AgendaFácil"
            className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
          />
          <h1 className="text-white text-2xl font-bold">AgendaFácil</h1>
          <p className="text-blue-100 text-sm mt-2 max-w-xs">
            Agendar faxina nunca foi tão fácil.
          </p>
        </div>

        {/* Lado do formulário */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-agenda-blue mb-1">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Entre com sua conta para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-agenda-teal focus:bg-white transition"
            />

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-agenda-teal focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-agenda-teal hover:bg-agenda-teal-dark text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 shadow-md shadow-agenda-teal/30"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

            {erro && (
              <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mt-4 text-center">
                {erro}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}