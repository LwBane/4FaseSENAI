-- Execute no banco configurado em DB_NAME antes de usar o cadastro.
-- Não cria contas prontas e não apaga uma tabela que já exista.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

-- Se a tabela já existir, confira sua estrutura com SHOW CREATE TABLE users.
-- Ela precisa dos campos acima e de uma restrição UNIQUE para email.

-- Banco que estamos usando 
USE desi_20251;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
);

CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE logs (
    id INT NOT NULL AUTO_INCREMENT,
    usuario INT,
    datahora DATETIME DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR(150),
    recurso_afetado VARCHAR(150),
    id_recurso_afetado VARCHAR(45),
    valor_antigo VARCHAR(250),
    valor_novo VARCHAR(250),
    campos_alterados TEXT,
    ip VARCHAR(45),
    codigo_http INT,
    status_acao VARCHAR(45),
    PRIMARY KEY (id)
);