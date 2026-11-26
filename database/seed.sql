USE mydb;
SET NAMES utf8mb4; -- garante acentos corretos

INSERT INTO area (id_area, nome_area) VALUES
  (1, 'Biologia'), (2, 'Agronomia'), (3, 'Genética'),
  (4, 'Medicina'), (5, 'Botânica'),
  (6, 'Física'), (7, 'Engenharia'), (8, 'Astronomia'),
  (9, 'Saúde Pública'), (10, 'Virologia'), (11, 'Epidemiologia'),
  (12, 'Psicologia'), (13, 'Neurociência'), (14, 'Educação'),
  (15, 'Computação');

INSERT INTO cientista (id_cientista, nome, biografia, ano_inicio_atuacao, ano_fim_atuacao, status) VALUES
  (1, 'Johanna Döbereiner', 'Agrônoma, pesquisadora da fixação biológica de nitrogênio, trabalho com grande impacto na agricultura brasileira.', 1951, 2000, 'aprovada'),
  (2, 'Mayana Zatz', 'Geneticista, referência no estudo de doenças neuromusculares e professora da USP.', 1970, NULL, 'aprovada'),
  (3, 'Jaqueline Goes de Jesus', 'Biomédica, integrou a equipe que sequenciou o genoma do SARS-CoV-2 no Brasil em 2020.', 2012, NULL, 'aprovada'),
  (4, 'Nise da Silveira', 'Psiquiatra, pioneira no uso da arte no tratamento psiquiátrico e fundadora do Museu de Imagens do Inconsciente.', 1926, 1999, 'aprovada'),
  (5, 'Graziela Barroso', 'Botânica, considerada uma das maiores especialistas em plantas brasileiras.', 1946, 2003, 'aprovada'),
  (6, 'Bertha Lutz', 'Bióloga, pesquisadora do Museu Nacional e defensora dos direitos das mulheres no Brasil.', 1918, 1976, 'aprovada'),
  (7, 'Sonia Guimarães', 'Física e professora do Instituto Tecnológico de Aeronáutica (ITA), com atuação em materiais semicondutores e educação científica.', 1989, NULL, 'aprovada'),
  (8, 'Enedina Alves Marques', 'Engenheira civil, pioneira na engenharia brasileira e primeira mulher negra formada em Engenharia no país.', 1945, 1981, 'aprovada'),
  (9, 'Ester Sabino', 'Médica e pesquisadora da USP, coordenou pesquisas de vigilância genômica e participou do sequenciamento inicial do SARS-CoV-2 no Brasil.', 1986, NULL, 'aprovada'),
  (10, 'Celina Turchi', 'Médica epidemiologista reconhecida por pesquisas que investigaram a associação entre infecção pelo vírus Zika e microcefalia.', 1980, NULL, 'aprovada'),
  (11, 'Márcia Barbosa', 'Física da UFRGS conhecida por pesquisas sobre propriedades anômalas da água e pela defesa da participação de mulheres na ciência.', 1988, NULL, 'aprovada'),
  (12, 'Carolina Bori', 'Psicóloga e professora que contribuiu para o desenvolvimento da psicologia experimental e da educação científica no Brasil.', 1947, 2004, 'aprovada'),
  (13, 'Duília de Mello', 'Astrônoma brasileira com pesquisas em formação estelar, evolução de galáxias e divulgação da astronomia.', 1990, NULL, 'aprovada');

INSERT INTO cientista_has_area (cientista_id_cientista, area_id_area) VALUES
  (1, 2), (1, 1), (2, 3), (3, 1), (3, 4), (4, 4), (5, 5), (5, 1),
  (6, 1), (6, 5), (7, 6), (7, 14), (8, 7),
  (9, 4), (9, 9), (9, 10), (10, 4), (10, 9), (10, 11),
  (11, 6), (12, 12), (12, 14), (13, 8);

INSERT INTO contribuicoes (id_contribuicao, impacto, descricao) VALUES
  (1, 'Agricultura', 'Fixação biológica de nitrogênio na soja'),
  (2, 'Saúde pública', 'Sequenciamento rápido do SARS-CoV-2'),
  (3, 'Direitos e ciência', 'Pesquisa biológica e defesa dos direitos das mulheres'),
  (4, 'Inclusão', 'Pesquisa em semicondutores e formação de estudantes'),
  (5, 'Engenharia', 'Atuação pioneira de uma engenheira negra no Brasil'),
  (6, 'Saúde pública', 'Vigilância genômica do SARS-CoV-2 no Brasil'),
  (7, 'Epidemiologia', 'Estudos sobre a associação entre Zika e microcefalia'),
  (8, 'Física', 'Pesquisa sobre propriedades anômalas da água'),
  (9, 'Educação científica', 'Consolidação da psicologia experimental no Brasil'),
  (10, 'Astronomia', 'Pesquisas sobre formação estelar e galáxias'),
  (11, 'Genética', 'Pesquisa de doenças genéticas e neuromusculares'),
  (12, 'Saúde mental', 'Uso de atividades expressivas no cuidado psiquiátrico'),
  (13, 'Botânica', 'Pesquisa e identificação de espécies da flora brasileira');

INSERT INTO cientista_has_contribuicoes (cientista_id_cientista, contribuicoes_id_contribuicao) VALUES
  (1, 1), (3, 2), (6, 3), (7, 4), (8, 5),
  (9, 6), (10, 7), (11, 8), (12, 9), (13, 10),
  (2, 11), (4, 12), (5, 13);

-- Uma sugestão pendente (aparece só para o admin, não na listagem pública)
INSERT INTO cientista (nome, biografia, ano_inicio_atuacao, nome_solicitante, email_solicitante, status) VALUES
  ('Cientista Sugerida', 'Exemplo de sugestão enviada pelo público.', 2010, 'Visitante', 'visitante@email.com', 'pendente');
