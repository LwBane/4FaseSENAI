const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== Conexao com o banco =====
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/', (req, res) => {
  res.send('API rodando!');
});

// ===== LOGIN =====
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha seu e-mail e/ou senha.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado no sistema.' });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
});

// ===== Listar clientes (pro dropdown do formulario) =====
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_cliente, nome, tipo_cliente FROM cliente ORDER BY nome');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar clientes.' });
  }
});

// ===== Listar profissionais (pro dropdown do formulario) =====
app.get('/api/profissionais', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_profissional, nome, especialidade FROM profissional ORDER BY nome');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar profissionais.' });
  }
});

// ===== Listar agendamentos (com busca opcional) =====
app.get('/api/agendamentos', async (req, res) => {
  const { busca } = req.query;

  try {
    let sql = `
      SELECT a.id_agendamento, a.tipo_servico, a.data_agendamento, a.hora_agendamento,
             a.status, a.observacoes,
             c.id_cliente, c.nome AS cliente_nome,
             p.id_profissional, p.nome AS profissional_nome
      FROM agendamento a
      JOIN cliente c ON c.id_cliente = a.id_cliente
      JOIN profissional p ON p.id_profissional = a.id_profissional
    `;
    const params = [];

    if (busca) {
      sql += ` WHERE c.nome LIKE ? OR p.nome LIKE ? OR a.status LIKE ? OR a.tipo_servico LIKE ?`;
      const termo = `%${busca}%`;
      params.push(termo, termo, termo, termo);
    }

    sql += ` ORDER BY a.data_agendamento, a.hora_agendamento`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
  }
});

// ===== Criar agendamento =====
app.post('/api/agendamentos', async (req, res) => {
  const { id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, observacoes } = req.body || {};

  if (!id_cliente || !id_profissional || !tipo_servico || !data_agendamento || !hora_agendamento) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatorios.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO agendamento (id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, observacoes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, observacoes || null]
    );
    res.status(201).json({ id_agendamento: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Esse profissional ja tem um agendamento nesse mesmo dia e horario.' });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar agendamento.' });
  }
});

// ===== Editar agendamento =====
app.put('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, status, observacoes } = req.body || {};

  if (!id_cliente || !id_profissional || !tipo_servico || !data_agendamento || !hora_agendamento) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatorios.' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE agendamento
       SET id_cliente = ?, id_profissional = ?, tipo_servico = ?, data_agendamento = ?,
           hora_agendamento = ?, status = ?, observacoes = ?
       WHERE id_agendamento = ?`,
      [id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, status || 'pendente', observacoes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    }

    res.json({ mensagem: 'Agendamento atualizado com sucesso.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Esse profissional ja tem um agendamento nesse mesmo dia e horario.' });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar agendamento.' });
  }
});

// ===== Excluir agendamento =====
app.delete('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM agendamento WHERE id_agendamento = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
    }

    res.json({ mensagem: 'Agendamento excluido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir agendamento.' });
  }
});

// ===== Middleware de tratamento de erro (garante resposta em JSON, nunca HTML) =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ erro: 'Requisição inválida. Verifique o corpo (body) enviado.' });
});

// ===== Iniciar servidor =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});