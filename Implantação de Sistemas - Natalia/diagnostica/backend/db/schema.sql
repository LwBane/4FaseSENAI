DROP DATABASE IF EXISTS faxina_db;
CREATE DATABASE faxina_db;
USE faxina_db;

-- =====================================================================
-- Usuários
-- =====================================================================
CREATE TABLE usuario (
  id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(120) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  criado_em    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- Clientes
-- =====================================================================
CREATE TABLE cliente (
  id_cliente   INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(120) NOT NULL,
  telefone     VARCHAR(20)  NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  endereco     VARCHAR(255) NOT NULL,
  tipo_cliente ENUM('residencial', 'comercial') NOT NULL,
  criado_em    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- Profissionais 
-- =====================================================================
CREATE TABLE profissional (
  id_profissional INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(120) NOT NULL,
  telefone        VARCHAR(20)  NOT NULL,
  especialidade   ENUM('residencial', 'comercial', 'ambos') NOT NULL DEFAULT 'ambos',
  disponivel      BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

-- =====================================================================
-- Agendamentos
-- =====================================================================
CREATE TABLE agendamento (
  id_agendamento   INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente       INT NOT NULL,
  id_profissional  INT NOT NULL,
  tipo_servico     ENUM('residencial', 'comercial') NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status           ENUM('pendente', 'confirmado', 'concluido', 'cancelado') NOT NULL DEFAULT 'pendente',
  observacoes      VARCHAR(255),
  criado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_agendamento_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
    ON DELETE CASCADE,

  CONSTRAINT fk_agendamento_profissional
    FOREIGN KEY (id_profissional) REFERENCES profissional(id_profissional)
    ON DELETE CASCADE,

  -- impede dois agendamentos pro mesmo profissional na mesma data/hora
  CONSTRAINT uq_profissional_horario UNIQUE (id_profissional, data_agendamento, hora_agendamento)
);

-- =====================================================================
-- População de dados 
-- =====================================================================

-- inserindo na mão por enquanto 
INSERT INTO usuario (nome, email, senha) VALUES
('Admin', 'admin@gmail.com', '$2b$10$pi3M4f4ey2vEJe3weaQXIem.tqJ6mrNf163SnRj3Zse1Pcu1PhtRu'),
('Emilie ', 'teste@gmail.com', '$2b$10$pi3M4f4ey2vEJe3weaQXIem.tqJ6mrNf163SnRj3Zse1Pcu1PhtRu'),
('Suporte', 'suporte@gmail.com', '$2b$10$pi3M4f4ey2vEJe3weaQXIem.tqJ6mrNf163SnRj3Zse1Pcu1PhtRu');

INSERT INTO cliente (nome, telefone, email, endereco, tipo_cliente) VALUES
('João Silva', '47999990001', 'joao.silva@email.com', 'Rua das Flores, 123 - Joinville/SC', 'residencial'),
('Maria Souza', '47999990002', 'maria.souza@email.com', 'Av. Central, 456 - Joinville/SC', 'residencial'),
('Empresa ABC Ltda', '47999990003', 'contato@empresaabc.com', 'Rua Comercial, 789 - Joinville/SC', 'comercial');

INSERT INTO profissional (nome, telefone, especialidade, disponivel) VALUES
('Carla Mendes', '47988880001', 'residencial', TRUE),
('Pedro Alves', '47988880002', 'comercial', TRUE),
('Ana Costa', '47988880003', 'ambos', TRUE);

INSERT INTO agendamento (id_cliente, id_profissional, tipo_servico, data_agendamento, hora_agendamento, status, observacoes) VALUES
(1, 1, 'residencial', '2026-08-10', '09:00:00', 'confirmado', 'Cliente pediu atenção especial na cozinha'),
(2, 3, 'residencial', '2026-08-11', '14:00:00', 'pendente', NULL),
(3, 2, 'comercial', '2026-08-12', '08:00:00', 'confirmado', 'Faxina pós-obra, sala grande');