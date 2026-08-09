import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

export default function CadastroAgendamento() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [erroForm, setErroForm] = useState('');

  const [form, setForm] = useState({
    id_cliente: '',
    id_profissional: '',
    tipo_servico: 'residencial',
    data_agendamento: '',
    hora_agendamento: '',
    status: 'pendente',
    observacoes: ''
  });

  const carregarAgendamentos = async (termo = '') => {
    try {
      const res = await axios.get(`${API}/agendamentos`, {
        params: { busca: termo }
      });
      setAgendamentos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
    axios.get(`${API}/clientes`).then(res => setClientes(res.data));
    axios.get(`${API}/profissionais`).then(res => setProfissionais(res.data));
  }, []);

  const handleBusca = (e) => {
    e.preventDefault();
    carregarAgendamentos(busca);
  };

  const abrirNovo = () => {
    setEditandoId(null);
    setErroForm('');
    setForm({
      id_cliente: '',
      id_profissional: '',
      tipo_servico: 'residencial',
      data_agendamento: '',
      hora_agendamento: '',
      status: 'pendente',
      observacoes: ''
    });
    setModalAberto(true);
  };

  const abrirEdicao = (ag) => {
    setEditandoId(ag.id_agendamento);
    setErroForm('');
    setForm({
      id_cliente: ag.id_cliente,
      id_profissional: ag.id_profissional,
      tipo_servico: ag.tipo_servico,
      data_agendamento: ag.data_agendamento.split('T')[0],
      hora_agendamento: ag.hora_agendamento,
      status: ag.status,
      observacoes: ag.observacoes || ''
    });
    setModalAberto(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErroForm('');

    if (
      !form.id_cliente ||
      !form.id_profissional ||
      !form.data_agendamento ||
      !form.hora_agendamento
    ) {
      setErroForm('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`${API}/agendamentos/${editandoId}`, form);
      } else {
        await axios.post(`${API}/agendamentos`, form);
      }

      setModalAberto(false);
      carregarAgendamentos(busca);
    } catch (err) {
      setErroForm(
        err.response?.data?.erro || 'Erro ao salvar agendamento.'
      );
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esse agendamento?')) return;

    try {
      await axios.delete(`${API}/agendamentos/${id}`);
      carregarAgendamentos(busca);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir agendamento.');
    }
  };

  return (
    <div className="min-h-screen bg-agenda-bg">
      {/* Header */}
      <header className="bg-agenda-blue px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="AgendaFácil"
            className="w-10 h-10 object-contain"
          />

          <h1 className="text-lg font-semibold text-white">
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

      <div className="p-6">
        {/* Título e botão */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/principal')}
              className="text-agenda-blue hover:text-agenda-blue-dark transition text-xl"
            >
              ←
            </button>

            <h2 className="text-2xl font-semibold text-agenda-blue">
              Cadastro de Agendamento
            </h2>
          </div>

          <button
            onClick={abrirNovo}
            className="bg-agenda-teal hover:bg-agenda-teal-dark text-white font-medium px-4 py-2 rounded-md transition"
          >
            + Novo Agendamento
          </button>
        </div>

        {/* Busca */}
        <form onSubmit={handleBusca} className="flex gap-2 mb-6 max-w-md">
          <input
            type="text"
            placeholder="Buscar por cliente, profissional, status..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agenda-teal"
          />

          <button
            type="submit"
            className="bg-agenda-blue hover:bg-agenda-blue-dark text-white px-4 py-2 rounded-md transition"
          >
            Buscar
          </button>
        </form>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-agenda-blue text-white">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Profissional</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}

              {agendamentos.map((ag) => (
                <tr
                  key={ag.id_agendamento}
                  className="border-t border-gray-100"
                >
                  <td className="px-4 py-3">
                    {ag.cliente_nome}
                  </td>

                  <td className="px-4 py-3">
                    {ag.profissional_nome}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {ag.tipo_servico}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      ag.data_agendamento
                    ).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-4 py-3">
                    {ag.hora_agendamento}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {ag.status}
                  </td>

                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => abrirEdicao(ag)}
                      className="text-agenda-blue hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleExcluir(ag.id_agendamento)
                      }
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de criar/editar */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleSalvar}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-agenda-blue mb-4">
                {editandoId
                  ? 'Editar Agendamento'
                  : 'Novo Agendamento'}
              </h3>

              <label className="block text-sm text-gray-600 mb-1">
                Cliente *
              </label>

              <select
                value={form.id_cliente}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_cliente: e.target.value
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              >
                <option value="">Selecione...</option>

                {clientes.map(c => (
                  <option
                    key={c.id_cliente}
                    value={c.id_cliente}
                  >
                    {c.nome}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-gray-600 mb-1">
                Profissional *
              </label>

              <select
                value={form.id_profissional}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_profissional: e.target.value
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              >
                <option value="">Selecione...</option>

                {profissionais.map(p => (
                  <option
                    key={p.id_profissional}
                    value={p.id_profissional}
                  >
                    {p.nome}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-gray-600 mb-1">
                Tipo de serviço *
              </label>

              <select
                value={form.tipo_servico}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipo_servico: e.target.value
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              >
                <option value="residencial">
                  Residencial
                </option>

                <option value="comercial">
                  Comercial
                </option>
              </select>

              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Data *
                  </label>

                  <input
                    type="date"
                    value={form.data_agendamento}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        data_agendamento: e.target.value
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Hora *
                  </label>

                  <input
                    type="time"
                    value={form.hora_agendamento}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hora_agendamento: e.target.value
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {editandoId && (
                <>
                  <label className="block text-sm text-gray-600 mb-1">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
                  >
                    <option value="pendente">
                      Pendente
                    </option>

                    <option value="confirmado">
                      Confirmado
                    </option>

                    <option value="concluido">
                      Concluído
                    </option>

                    <option value="cancelado">
                      Cancelado
                    </option>
                  </select>
                </>
              )}

              <label className="block text-sm text-gray-600 mb-1">
                Observações
              </label>

              <textarea
                value={form.observacoes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    observacoes: e.target.value
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
                rows={2}
              />

              {erroForm && (
                <p className="text-red-500 text-sm mb-3">
                  {erroForm}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-gray-600 hover:underline"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-agenda-teal hover:bg-agenda-teal-dark text-white font-medium px-4 py-2 rounded-md transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}