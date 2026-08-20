CREATE DATABASE desi_20251;

USE desi_20251;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL
);

INSERT INTO usuario (nome, email, senha, perfil)
VALUES
('Ana', 'ana@email.com', '123456', 'admin'),
('Joao', 'joao@email.com', '123456', 'usuario');