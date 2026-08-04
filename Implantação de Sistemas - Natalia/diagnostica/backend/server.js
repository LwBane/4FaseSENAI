const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== Conexão com o banco =====
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

// ===== LOGIN 
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha email e senha.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});