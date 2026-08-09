# AgendaFácil — Sistema de Agendamento de Serviços de Limpeza

Sistema web para agendamento de serviços de faxina residencial e comercial, com gestão de clientes, profissionais e horários.

Projeto desenvolvido para a disciplina de **Implantação de Sistemas** — Atividade de Nivelamento (4ª fase).

## Tecnologias utilizadas

- **Backend:** Node.js + Express
- **Frontend:** React (Vite) + Tailwind CSS
- **Banco de dados:** MySQL

## Como rodar o projeto

### 1. Banco de dados

Rode o script de criação e população do banco:

```bash
mysql -u root -p < backend/db/schema.sql
```

Isso cria o banco `faxina_db` com as tabelas `usuario`, `cliente`, `profissional` e `agendamento`, já com registros de exemplo.

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/` com o seguinte conteúdo (ajuste a senha do seu MySQL):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=faxina_db
JWT_SECRET=uma_frase_secreta_qualquer_aqui
PORT=3000
```

Rode o servidor:

```bash
npm run dev
```

O backend sobe em `http://localhost:3000`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Login de teste

Use as credenciais abaixo para acessar o sistema:

| Email | Senha |
|-------|-------|
| admin@gmail.com | 123456 |

## Funcionalidades

- Login com autenticação
- Interface principal com acesso rápido às demais telas
- Cadastro de agendamentos (criar, editar, buscar, excluir)
- Gestão de agendamentos (listagem ordenada e movimentação, com verificação automática de conflito de horário)