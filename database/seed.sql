-- Dados de EXEMPLO para testar o sistema.
-- Rodar DEPOIS do schema.sql.
-- Conferir/ajustar os textos antes da apresentação.
USE mydb;
SET NAMES utf8mb4; -- garante acentos corretos

INSERT INTO area (id_area, nome_area) VALUES
  (1, 'Biologia'), (2, 'Agronomia'), (3, 'Genética'),
  (4, 'Medicina'), (5, 'Botânica');

INSERT INTO cientista (id_cientista, nome, biografia, ano_inicio_atuacao, ano_fim_atuacao, status) VALUES
  (1, 'Johanna Döbereiner', 'Agrônoma, pesquisadora da fixação biológica de nitrogênio, trabalho com grande impacto na agricultura brasileira.', 1951, 2000, 'aprovada'),
  (2, 'Mayana Zatz', 'Geneticista, referência no estudo de doenças neuromusculares e professora da USP.', 1970, NULL, 'aprovada'),
  (3, 'Jaqueline Goes de Jesus', 'Biomédica, integrou a equipe que sequenciou o genoma do SARS-CoV-2 no Brasil em 2020.', 2012, NULL, 'aprovada'),
  (4, 'Nise da Silveira', 'Psiquiatra, pioneira no uso da arte no tratamento psiquiátrico e fundadora do Museu de Imagens do Inconsciente.', 1926, 1999, 'aprovada'),
  (5, 'Graziela Barroso', 'Botânica, considerada uma das maiores especialistas em plantas brasileiras.', 1946, 2003, 'aprovada');

INSERT INTO cientista_has_area (cientista_id_cientista, area_id_area) VALUES
  (1, 2), (1, 1), (2, 3), (3, 1), (3, 4), (4, 4), (5, 5), (5, 1);

INSERT INTO contribuicoes (id_contribuicao, impacto, descricao) VALUES
  (1, 'Agricultura', 'Fixação biológica de nitrogênio na soja'),
  (2, 'Saúde pública', 'Sequenciamento rápido do SARS-CoV-2');

INSERT INTO cientista_has_contribuicoes (cientista_id_cientista, contribuicoes_id_contribuicao) VALUES
  (1, 1), (3, 2);

-- Uma sugestão pendente (aparece só para o admin, não na listagem pública)
INSERT INTO cientista (nome, biografia, ano_inicio_atuacao, nome_solicitante, email_solicitante, status) VALUES
  ('Cientista Sugerida', 'Exemplo de sugestão enviada pelo público.', 2010, 'Visitante', 'visitante@email.com', 'pendente');
