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