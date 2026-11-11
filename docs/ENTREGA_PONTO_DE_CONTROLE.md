# Relatório de entrega — Fechar as features funcionais

**Projeto:** Mulheres Brasileiras na Ciência — Catálogo de Cientistas

**Data da análise:** 10/11/2026

**Referência:** requisitos do card fornecidos pelo responsável; código-fonte do arquivo ZIP enviado.

> **Escopo verificado:** foi possível ler o código e implementar as alterações na cópia do projeto. O quadro Trello e o repositório remoto não foram consultados; não há histórico `.git` dentro do ZIP. O feedback dos professores também não foi fornecido. O ambiente utilizado não dispõe de MySQL nem das dependências npm para executar a aplicação no navegador. Portanto, os testes registrados abaixo **não** comprovam execução ponta a ponta com banco real.

## 1. Situação de cada item do card

| Requisito | Situação na cópia entregue | Evidências / observações |
|---|---|---|
| Tela de administração | Implementado | `frontend/src/pages/Admin.jsx`, rota `/admin`, link no menu. Lista, formulário de cadastro/edição, confirmação de exclusão, mensagens de sucesso/erro. |
| Sugestões no admin | Implementado | Aba de sugestões pendentes, Aprovar/Recusar, atualização de `status` em `cientista`, recarga das listas. |
| Rotas do admin | Implementado | `GET/POST /api/admin/cientistas`, `PUT/DELETE /api/admin/cientistas/:id`, `GET /api/admin/sugestoes`, `PATCH /api/admin/sugestoes/:id`, `GET /api/admin/sessao`. Todas protegidas por token. |
| Telas públicas | Implementado no código; validação visual pendente | Catálogo com busca por nome/área e filtro por ID da área, biografia resumida nos cards, perfil com publicações, mensagens de loading/erro, formulário de sugestão com prevenção de duplo envio. |
| Corrigir defeitos do feedback | Parcial | Corrigidos defeitos identificados no ZIP. Sem acesso ao feedback real dos professores, não é possível confirmar todos os apontamentos. |
| Teste geral | Parcial | 23 testes unitários/de contrato aprovados e 16 arquivos JS/JSX analisados sem erros sintáticos. Execução E2E real e inspeção visual não realizadas neste ambiente. |
| Registrar o Won't | Documentado | Consulte a seção 5 deste documento e o roteiro manual. A comunicação aos colegas ainda precisa ser feita pelo responsável. |
| Commits e branch principal | Pendente fora da cópia | O ZIP não contém `.git`, nem há acesso ao GitHub/Git remoto; não houve push, merge, nem verificação de autores dos commits. |

## 2. Implementação detalhada

### Backend e banco

- O banco **já tinha** `status ENUM('pendente','aprovada','rejeitada')`; não foi necessário modificar o schema.
- Criação administrativa insere cientista com `status='aprovada'` e vínculos com áreas de atuação.
- Edição administrativa atualiza os dados e substitui os vínculos com áreas dentro de uma transação.
- Exclusão administrativa apaga primeiro as relações N:N, para respeitar as FKs sem `ON DELETE CASCADE`, e exclui a cientista dentro de uma transação.
- Sugestões continuam entrando como `pendente`. Aprovação/recusa usa `UPDATE ... WHERE status = 'pendente'` para impedir análise duplicada. São retornados 404 para inexistente e 409 para já analisada.
- Consultas públicas selecionam apenas registros `aprovada`. A busca por texto agora pesquisa nome **ou nome de área**. Dados do solicitante não são expostos no DTO público.
- API recebe validações de campos obrigatórios, tamanhos, anos, e-mail, identificadores e áreas; SQL parametrizado com `?`.
- Middleware `verificarAdmin` exige `Authorization: Bearer <ADMIN_TOKEN>` (mínimo 16 caracteres), devolvendo 401 para não autenticado e 503 quando não configurado.

**Importante:** a autenticação por token estático é uma proteção simples adequada à demonstração acadêmica. Para uso público real, seria preciso autenticação por contas, senha com hash, sessões seguras, limitação de tentativas, controle de permissões e logs de auditoria. Não publique o token em Git nem no `.env` do frontend.

### Frontend

- Administração em `/admin`: entrada por token, abas de listagem e sugestões, cadastro/edição com seleção de áreas e exclusão/aprovação/recusa mediante confirmação.
- Catálogo em `/cientistas`: consulta a API usando `?busca=...&area=...` e preserva os filtros na URL; mostra carregamento, quantidade, vazio e erro.
- Perfil em `/cientistas/:id`: trajetória, áreas, prêmios, contribuições, publicações, 404 e recuperação de falhas.
- Página inicial: pesquisa encaminha ao catálogo; falhas na carga de destaques são exibidas.
- Sugestão pública em `/sugerir`: ano final opcional, validação básica de formulário e indicador de envio.
- Tratamento de erros de rede e HTTP centralizado em `frontend/src/services/cientistasService.js`.
- CSS acrescentado para a administração e melhorias responsivas.

## 3. Endpoints disponíveis

| Verbo | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| GET | `/api/health` | Público | Testar conexão API/banco |
| GET | `/api/areas` | Público | Listar áreas |
| GET | `/api/cientistas?busca=...&area=...` | Público | Listar aprovadas e filtrar |
| GET | `/api/cientistas/:id` | Público | Perfil de cientista aprovada |
| POST | `/api/sugestoes` | Público | Enviar sugestão pendente |
| GET | `/api/admin/sessao` | Admin | Validar token |
| GET | `/api/admin/cientistas` | Admin | Listar todos os status |
| POST | `/api/admin/cientistas` | Admin | Cadastrar aprovada |
| PUT | `/api/admin/cientistas/:id` | Admin | Editar cadastro e áreas |
| DELETE | `/api/admin/cientistas/:id` | Admin | Excluir cadastro |
| GET | `/api/admin/sugestoes` | Admin | Listar pendentes |
| PATCH | `/api/admin/sugestoes/:id` | Admin | Aprovar ou recusar (`{ "status": "aprovada" | "rejeitada" }`) |

**Exemplo POST/PUT admin:**

```json
{
  "nome": "Cientista Exemplo",
  "biografia": "Pesquisadora brasileira...",
  "anoInicio": 2000,
  "anoFim": null,
  "areas": [1, 3]
}
```

Requisições de administração devem conter header `Authorization: Bearer SEU_TOKEN`. As rotas públicas **não** recebem token.

## 4. Testes realmente executados

| Verificação | Comando / método | Resultado |
|---|---|---|
| Testes de service, repository e autenticação | `cd backend && npm test` | **18 aprovados**, 0 reprovados. Repositório/SQL com mocks, sem MySQL. |
| Testes de contrato da camada HTTP do frontend | `cd frontend && npm test` | **5 aprovados**, 0 reprovados. `fetch` simulado. |
| Sintaxe backend | `node --check` em todos os JS do backend | Sem erro. |
| Sintaxe React | Parser TypeScript em 16 arquivos JS/JSX | Sem erro sintático. Não equivale a build/lint. |
| Instalação offline de dependências frontend | `npm ci --offline` | **Não concluída**: `ENOTCACHED` para pacote npm. Foi emitido também aviso de Node 22.16.0 inferior ao necessário para `react-router@8.4.0` (>=22.22.0). |
| Build/lint frontend | `npm run build`, `npm run lint` | Não executados com dependências instaladas; dependem de `npm ci`. |
| Teste E2E com Express + MySQL | `node --env-file=.env test/fluxoE2E.mjs` | **Preparado, não executado**; requer banco/API rodando. |
| Teste manual no navegador | `docs/ROTEIRO_TESTE_MANUAL.md` | **Pendente**; depende da aplicação rodando. |

**Limitação:** unit tests com mocks garantem regras e contratos simulados, mas não garantem compatibilidade final entre MySQL, Express, React e navegador. Portanto o critério “telas funcionando de ponta a ponta” precisa de validação local antes de mover o card para Done.

## 5. Won't / pendências para comunicar na reunião

- **Não validado:** feedback específico dos professores e outros cards do Trello; não houve acesso ao quadro. É necessário confrontar os requisitos reais e incluir eventuais correções restantes.
- **Não validado:** fluxo com banco MySQL real, renderização das telas no navegador, responsividade visual e `npm run lint`/`npm run build`.
- **Não realizado:** commit/push no Git remoto, merge para `main` e auditoria de commits de todos os integrantes. A cópia ZIP não inclui o repositório Git.
- **Fora do escopo para o ponto de controle:** login de múltiplos administradores, controle avançado de permissões, logs de auditoria, rate limiting, fotos/imagens individuais e edição administrativa de prêmios/publicações/contribuições (o card cobre campos básicos e áreas).

**Atenção:** itens não validados não devem ser tratados automaticamente como “Won't” no Trello — só entram em “Won't” quando a equipe decidir que não serão feitos nesta entrega. Caso contrário, são tarefas pendentes/impedimentos.

## 6. Passos para finalizar a entrega de verdade

1. Verificar se existem correções do feedback dos professores e outros cards dependentes.
2. Configurar o MySQL com `database/schema.sql` **somente em banco de teste** (script apaga tabelas), executar `database/seed.sql` uma vez.
3. Criar `backend/.env` com dados do banco e token secreto forte; criar `frontend/.env` com `VITE_API_URL=http://localhost:3000/api`.
4. Instalar as dependências com Node >= 22.22 (`npm ci` em `backend/` e `frontend/`). Rodar backend e frontend.
5. Executar `npm test` nos dois diretórios, `npm run lint`/`npm run build` no frontend e `node --env-file=.env test/fluxoE2E.mjs` no backend; seguir o roteiro manual.
6. Fazer revisão de código com a equipe e então commit/push na branch de trabalho, abrir PR/merge para `main`, conferir CI e autores dos commits.
7. Colar `docs/RESUMO_PARA_TRELLO.md` como comentário no card e informar a pessoa responsável pela apresentação/realinhamento.

## 7. Arquivos principais alterados/criados

- `backend/src/controllers/cientistaController.js`
- `backend/src/dtos/cientistaDto.js`
- `backend/src/middlewares/verificarAdmin.js` (novo)
- `backend/src/repositories/cientistaRepository.js`
- `backend/src/routes/index.js`
- `backend/src/services/cientistaService.js`
- `backend/.env.example`
- `backend/package.json`
- `backend/test/*.test.js` e `backend/test/fluxoE2E.mjs` (novos)
- `frontend/src/pages/Admin.jsx` (novo)
- `frontend/src/pages/Catalogo.jsx`, `Home.jsx`, `PerfilCientista.jsx`, `SugerirCientista.jsx`
- `frontend/src/components/CampoBusca.jsx`, `CientistaCard.jsx`, `Header.jsx`
- `frontend/src/routes/AppRoutes.jsx`
- `frontend/src/services/cientistasService.js`
- `frontend/src/styles/theme.css`
- `frontend/package.json`, `frontend/test/cientistasService.test.cjs` (novo)
- `README.md` e `docs/*`.
