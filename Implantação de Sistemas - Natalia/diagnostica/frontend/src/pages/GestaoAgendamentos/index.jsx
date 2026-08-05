import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

// Ordenação simples (bubble sort) por data/hora
function ordenarPorData(lista) {
  const arr = [...lista];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      const a = `${arr[j].data_agendamento}${arr[j].hora_agendamento}`;
      const b = `${arr[j + 1].data_agendamento}${arr[j + 1].hora_agendamento}`;
      if (a > b) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

export default function GestaoAgendamentos() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [profissionalNovo, setProfissionalNovo] = useState('');
  const [dataNova, setDataNova] = useState('');
  const [horaNova, setHoraNova] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get(`${API}/agendamentos`).then(res => setAgendamentos(ordenarPorData(res.data)));
    axios.get(`${API}/profissionais`).then(res => setProfissionais(res.data));
  }, []);

  const selecionar = (ag) => {
    setSelecionado(ag);
    setProfissionalNovo(ag.id_profissional);
    setDataNova(ag.data_agendamento.split('T')[0]);
    setHoraNova(ag.hora_agendamento);
    setMensagem('');
  };

  const mover = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await axios.put(`${API}/agendamentos/${selecionado.id_agendamento}`, {
        ...selecionado,
        id_profissional: profissionalNovo,
        data_agendamento: dataNova,
        hora_agendamento: horaNova
      });
      setMensagem('Movimentado com sucesso!');
      const res = await axios.get(`${API}/agendamentos`);
      setAgendamentos(ordenarPorData(res.data));
    } catch (err) {
      setMensagem(err.response?.data?.erro || 'Erro ao mover agendamento.');
    }
  };

  return (
    <div className="min-h-screen bg-agenda-bg p-6">
      <button onClick={() => navigate('/principal')} className="text-agenda-blue hover:underline mb-6">
        ← Voltar
      </button>

      <h2 className="text-2xl font-semibold text-agenda-blue mb-6">Gestão de Agendamentos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista */}
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
          {agendamentos.map((ag) => (
            <button
              key={ag.id_agendamento}
              onClick={() => selecionar(ag)}
              className="w-full text-left px-4 py-3 hover:bg-agenda-bg"
            >
              <p className="font-medium text-agenda-blue">{ag.cliente_nome}</p>
              <p className="text-sm text-gray-500">
                {ag.profissional_nome} · {new Date(ag.data_agendamento).toLocaleDateString('pt-BR')} {ag.hora_agendamento}
              </p>
            </button>
          ))}
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          {!selecionado ? (
            <p className="text-gray-400">Selecione um agendamento para movimentar.</p>
          ) : (
            <form onSubmit={mover}>
              <label className="block text-sm text-gray-600 mb-1">Profissional</label>
              <select
                value={profissionalNovo}
                onChange={(e) => setProfissionalNovo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              >
                {profissionais.map(p => (
                  <option key={p.id_profissional} value={p.id_profissional}>{p.nome}</option>
                ))}
              </select>

              <label className="block text-sm text-gray-600 mb-1">Data</label>
              <input
                type="date"
                value={dataNova}
                onChange={(e) => setDataNova(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              />

              <label className="block text-sm text-gray-600 mb-1">Hora</label>
              <input
                type="time"
                value={horaNova}
                onChange={(e) => setHoraNova(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              />

              {mensagem && <p className="text-sm mb-3">{mensagem}</p>}

              <button type="submit" className="w-full bg-agenda-teal text-white font-medium py-2 rounded-md">
                Confirmar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}