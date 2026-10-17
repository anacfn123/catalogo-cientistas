-- Script de criação do banco - Catálogo de Cientistas Brasileiras
-- Rodar no MySQL Workbench: File > Open SQL Script > este arquivo > executar (raio).
-- ATENÇÃO: apaga e recria as tabelas (os dados existentes são perdidos).

CREATE DATABASE IF NOT EXISTS mydb DEFAULT CHARACTER SET utf8mb3;
USE mydb;
SET NAMES utf8mb4; -- garante acentos corretos

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS cientista_has_area, cientista_has_premio,
  cientista_has_publicacoes, cientista_has_contribuicoes,
  cientista, area, premio, publicacoes, contribuicoes;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabelas principais ---------------------------------------------

CREATE TABLE cientista (
  id_cientista INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  biografia TEXT NOT NULL,
  ano_inicio_atuacao YEAR NOT NULL,
  ano_fim_atuacao YEAR DEFAULT NULL,
  nome_solicitante VARCHAR(150) DEFAULT NULL,
  email_solicitante VARCHAR(150) DEFAULT NULL,
  status ENUM('pendente','aprovada','rejeitada') NOT NULL DEFAULT 'pendente',
  PRIMARY KEY (id_cientista)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE area (
  id_area INT NOT NULL AUTO_INCREMENT,
  nome_area VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE premio (
  id_premio INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  instituicao_concedente VARCHAR(150) NOT NULL,
  PRIMARY KEY (id_premio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE publicacoes (
  id_publicacao INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  ano YEAR NOT NULL,
  veiculo VARCHAR(150) NOT NULL,
  PRIMARY KEY (id_publicacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE contribuicoes (
  id_contribuicao INT NOT NULL AUTO_INCREMENT,
  impacto VARCHAR(100) NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_contribuicao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabelas de relacionamento (N:N) ---------------------------------

CREATE TABLE cientista_has_area (
  cientista_id_cientista INT NOT NULL,
  area_id_area INT NOT NULL,
  PRIMARY KEY (cientista_id_cientista, area_id_area),
  CONSTRAINT fk_cientista_has_area_cientista1 FOREIGN KEY (cientista_id_cientista) REFERENCES cientista (id_cientista),
  CONSTRAINT fk_cientista_has_area_area1 FOREIGN KEY (area_id_area) REFERENCES area (id_area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE cientista_has_premio (
  cientista_id_cientista INT NOT NULL,
  premio_id_premio INT NOT NULL,
  ano YEAR NOT NULL,
  PRIMARY KEY (cientista_id_cientista, premio_id_premio),
  CONSTRAINT fk_cientista_has_premio_cientista1 FOREIGN KEY (cientista_id_cientista) REFERENCES cientista (id_cientista),
  CONSTRAINT fk_cientista_has_premio_premio1 FOREIGN KEY (premio_id_premio) REFERENCES premio (id_premio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE cientista_has_publicacoes (
  cientista_id_cientista INT NOT NULL,
  publicacoes_id_publicacao INT NOT NULL,
  PRIMARY KEY (cientista_id_cientista, publicacoes_id_publicacao),
  CONSTRAINT fk_cientista_has_publicacoes_cientista1 FOREIGN KEY (cientista_id_cientista) REFERENCES cientista (id_cientista),
  CONSTRAINT fk_cientista_has_publicacoes_publicacoes1 FOREIGN KEY (publicacoes_id_publicacao) REFERENCES publicacoes (id_publicacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE cientista_has_contribuicoes (
  cientista_id_cientista INT NOT NULL,
  contribuicoes_id_contribuicao INT NOT NULL,
  PRIMARY KEY (cientista_id_cientista, contribuicoes_id_contribuicao),
  CONSTRAINT fk_cientista_has_contribuicoes_cientista FOREIGN KEY (cientista_id_cientista) REFERENCES cientista (id_cientista),
  CONSTRAINT fk_cientista_has_contribuicoes_contribuicoes1 FOREIGN KEY (contribuicoes_id_contribuicao) REFERENCES contribuicoes (id_contribuicao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
