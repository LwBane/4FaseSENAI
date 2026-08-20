import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8081;

// ==> Insegurança: Conexão era insegura com o banco, usuário de forma direta e senha vazia 
// const db = await mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "desi_20251"
// });

// Teria que criar um arquivo .env e depois fazer uma conexão dessa maneira: 
const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// ===============================
// LOGIN
// ===============================

// ==> Insegurança: Perigo de SQL Injection, os dados estão sendo colocados diretamente na consulta
// SQL, deveria ser algo como WHERE email = ?. 

// ==> Insegurança: Ao realizar login retornava todas as informações do usuário 


app.post("/login", async (req, res) => {

    const { email, senha } = req.body;

    try {

        if(!email && !senha)
            return res.status(400).json({mensagem: "Os campos de e-mail e senha são obrigatórios", sucess: false});


        // Validação se o e-mail é válido 

        
        const [usuarios] = await db.query(
            `SELECT * FROM usuario 
            WHERE email = ? 
            AND senha = ?`,
            [email, senha]
        );
        
        const senhaValida = bcrypt.compare(senha, usuarios.senha)


        if (usuarios.length > 0) {

            res.json({
                mensagem: "Login realizado com sucesso!",
                sucess: true
                // usuario: usuarios[0]
            });

        } else {

            res.status(401).json({
                mensagem: "Usuário ou senha incorretos"
            });

        }

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao realizar login"
        });

    }

});


// ===============================
// BUSCAR USUÁRIO
// ===============================

// ==> Insegurança: Qualquer um que tenha conhecimento da rota pode acessá-la 

app.get("/usuarios/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ${id}`
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        res.json(usuarios[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao buscar usuário"
        });

    }

});


// ===============================
// ÁREA ADMINISTRATIVA
// ===============================

// ==> Insegurança: Sem verificação de permissão pra essa área, então pode haver exclusão 
// de usuário sem a devida segurança 


app.delete("/usuarios/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [usuarios] = await db.query(
            `SELECT * FROM usuario WHERE id = ${id}`
        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });

        }

        await db.query(
            `DELETE FROM usuario WHERE id = ${id}`
        );

        res.json({
            mensagem: `Usuário ${usuarios[0].nome} excluído com sucesso!`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao excluir usuário"
        });

    }

});

// ===============================
// TRATAMENTO DE ERRO
// ===============================

// ==> Insegurança de antes: Exposição de dados sensíveis sem necessidade 


app.get("/erro", (req, res) => {
    throw new Error(
        "Erro no banco de dados"
        // "Erro no banco de dados: senha do banco = 123456"
    );
});


// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na portinha => http://localhost:${PORT}/`
    );
});