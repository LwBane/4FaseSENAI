import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await axios.post('http://localhost:3000/api/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/principal');
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Erro ao tentar fazer login.';
      setErro(mensagem);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-agenda-bg">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="AgendaFácil" className="w-32 h-32 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-agenda-blue text-center">
          Entrar
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-agenda-teal"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-agenda-teal"
        />

        <button
          type="submit"
          className="w-full bg-agenda-blue hover:bg-agenda-blue-dark text-white font-medium py-2 rounded-md transition"
        >
          Entrar
        </button>

        {erro && (
          <p className="text-red-500 text-sm mt-4 text-center">{erro}</p>
        )}
      </form>
    </div>
  );
}