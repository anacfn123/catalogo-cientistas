USE mydb;

-- Áreas de atuação
INSERT INTO area (id_area, nome_area) VALUES
  (1, 'Biologia'), (2, 'Agronomia'), (3, 'Genética'),
  (4, 'Medicina'), (5, 'Botânica'),
  (6, 'Física'), (7, 'Engenharia'), (8, 'Astronomia'),
  (9, 'Saúde Pública'), (10, 'Virologia'), (11, 'Epidemiologia'),
  (12, 'Psicologia'), (13, 'Neurociência'), (14, 'Educação'),
  (15, 'Computação');

-- Cientistas
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

-- Áreas de cada cientista
INSERT INTO cientista_has_area (cientista_id_cientista, area_id_area) VALUES
  (1, 2), (1, 1), (2, 3), (3, 1), (3, 4), (4, 4), (5, 5), (5, 1),
  (6, 1), (6, 5), (7, 6), (7, 14), (8, 7),
  (9, 4), (9, 9), (9, 10), (10, 4), (10, 9), (10, 11),
  (11, 6), (12, 12), (12, 14), (13, 8);

-- Contribuições
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

-- Contribuições de cada cientista
INSERT INTO cientista_has_contribuicoes (cientista_id_cientista, contribuicoes_id_contribuicao) VALUES
  (1, 1), (3, 2), (6, 3), (7, 4), (8, 5),
  (9, 6), (10, 7), (11, 8), (12, 9), (13, 10),
  (2, 11), (4, 12), (5, 13);

-- Prêmios
INSERT INTO premio (id_premio, nome, instituicao_concedente) VALUES
  (1, 'Prêmio Frederico Menezes Veiga', 'Embrapa'),
  (2, 'Prêmio Bernardo Houssay', 'Organização dos Estados Americanos (OEA)'),
  (3, 'Prêmio UNESCO de Ciência', 'UNESCO'),
  (4, 'Prêmio L''Oréal-UNESCO Para Mulheres na Ciência', 'Fundação L''Oréal e UNESCO'),
  (5, 'Prêmio TWAS em Ciências Médicas Básicas', 'Academia Mundial de Ciências (TWAS)'),
  (6, 'Medalha Nicholson', 'American Physical Society (APS)'),
  (7, 'Millennium Botany Award', 'Congresso Internacional de Botânica'),
  (8, 'Programa Para Mulheres na Ciência', 'L''Oréal Brasil, UNESCO e Academia Brasileira de Ciências'),
  (9, 'Nature''s 10', 'Revista Nature'),
  (10, 'IAU STEM Ambassador Recognition Award Medal', 'União Astronômica Internacional (IAU)');

-- Prêmios de cada cientista (com o ano)
INSERT INTO cientista_has_premio (cientista_id_cientista, premio_id_premio, ano) VALUES
  (1, 1, 1976), (1, 2, 1979), (1, 3, 1989),
  (2, 4, 2001), (2, 5, 2003),
  (11, 6, 2009), (11, 4, 2013),
  (5, 7, 1999),
  (3, 8, 2023),
  (10, 9, 2016),
  (13, 10, 2025);

-- Publicações
INSERT INTO publicacoes (id_publicacao, titulo, ano, veiculo) VALUES
  (1, 'Host-plant specificity in the infection of cereals with Azospirillum spp.', 1980, 'Soil Biology and Biochemistry'),
  (2, 'The 10 autosomal recessive limb-girdle muscular dystrophies', 2003, 'Neuromuscular Disorders'),
  (3, 'A gene which causes severe ocular alterations and occipital encephalocele (Knobloch syndrome) is mapped to 21q22.3', 1996, 'Human Molecular Genetics'),
  (4, 'Importation and early local transmission of COVID-19 in Brazil, 2020', 2020, 'Revista do Instituto de Medicina Tropical de São Paulo'),
  (5, 'Genomics and epidemiology of the P.1 SARS-CoV-2 lineage in Manaus, Brazil', 2021, 'Science'),
  (6, 'Imagens do Inconsciente', 1981, 'Editora Alhambra (livro)'),
  (7, 'Sistemática de Angiospermas do Brasil (volume 1)', 1978, 'Livros Técnicos e Científicos / Edusp (livro)'),
  (8, 'Frutos e sementes: morfologia aplicada à sistemática de dicotiledôneas', 1999, 'Editora UFV (livro)'),
  (9, 'Association between Zika virus infection and microcephaly in Brazil, January to May, 2016: preliminary report of a case-control study', 2016, 'The Lancet Infectious Diseases'),
  (10, 'Thermodynamic and dynamic anomalies for a three-dimensional isotropic core-softened potential', 2006, 'The Journal of Chemical Physics');

  -- Publicações de cada cientista
INSERT INTO cientista_has_publicacoes (cientista_id_cientista, publicacoes_id_publicacao) VALUES
  (1, 1), (2, 2), (2, 3), (3, 4), (9, 4), (3, 5), (9, 5),
  (4, 6), (5, 7), (5, 8), (10, 9), (11, 10);

-- Sugestão pendente (exemplo)
INSERT INTO cientista (nome, biografia, ano_inicio_atuacao, nome_solicitante, email_solicitante, status) VALUES
  ('Cientista Sugerida', 'Exemplo de sugestão enviada pelo público.', 2010, 'Visitante', 'visitante@email.com', 'pendente');