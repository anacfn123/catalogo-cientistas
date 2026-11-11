# Mulheres Brasileiras na Ciência — Catálogo de Cientistas

Aplicação web acadêmica dedicada à divulgação da trajetória e das contribuições de mulheres brasileiras para a ciência.

**Tecnologias:** React + Vite + React Router, Node.js + Express 5, MySQL.

## Integrantes

- Ana Clara Fagundes
- Ana Clara Seabra
- Arthur de Morais
- Filipe Lage
- Mallu Siqueira

## O que existe nesta versão

- Página inicial, catálogo pesquisável por nome ou área de atuação e filtros por área.
- Perfil com biografia, áreas de atuação, prêmios, contribuições e publicações.
- Formulário público de sugestão; sugestões ficam `pendente` até moderação.
- Painel `/admin` com cadastro, edição, exclusão e aprovação/recusa de sugestões.
- Rotas administrativas protegidas por token, validações de entrada e transações SQL.
- Testes automatizados de regras backend e contratos HTTP do frontend.

## Requisitos

- Node.js **>= 22.22.0** (exigido pelo `react-router@8.4.0` do package-lock recebido).
- npm compatível.
- MySQL 8 ou versão compatível.

## Configuração

1. Configure o MySQL **num banco descartável de desenvolvimento**. Execute `database/schema.sql` seguido de `database/seed.sql` **uma única vez** no MySQL Workbench ou cliente MySQL.
   - **Cuidado:** o schema **remove e recria tabelas**. Nunca execute sobre dados importantes.
   - O banco padrão do script se chama `mydb`.
2. No diretório `backend`, copie `.env.example` para `.env` e configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` e `ADMIN_TOKEN`.
   - Escolha um `ADMIN_TOKEN` aleatório, privado, com pelo menos 16 caracteres (ideal 32+). A amostra `.env.example` é apenas ilustrativa, **não** use o token de exemplo em uma instalação publicada.
3. No diretório `frontend`, copie `.env.example` para `.env`; mantenha `VITE_API_URL=http://localhost:3000/api` se o backend usar a porta padrão.
4. Abra dois terminais:

   **Terminal backend:**
   ```bash
   cd backend
   npm ci
   npm run dev
   ```

   **Terminal frontend:**
   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

5. Acesse a URL exibida pelo Vite, normalmente `http://localhost:5173`. O painel fica em `/admin`. Insira nele o token definido em **`backend/.env`** (não exponha esse token em `frontend/.env`).

## Testes

Testes unitários/contratos sem banco nem serviços externos:

```bash
cd backend && npm test
cd ../frontend && npm test
```

Com dependências instaladas, valide também:

```bash
cd frontend
npm run lint
npm run build
```

Com banco e backend ligados, rode o **smoke test E2E real da API** (cria e remove registros temporários — usar **somente em banco de teste**):

```bash
cd backend
node --env-file=.env test/fluxoE2E.mjs
```

Para verificar o site visualmente, siga [o roteiro manual](docs/ROTEIRO_TESTE_MANUAL.md).

## API

- `GET /api/health`: verifica banco.
- `GET /api/areas`: áreas.
- `GET /api/cientistas?busca=...&area=...`: listagem pública somente de aprovadas.
- `GET /api/cientistas/:id`: perfil público.
- `POST /api/sugestoes`: envia sugestão pendente.
- `GET /api/admin/sessao`: confere token.
- `GET /api/admin/cientistas`: lista todas as cientistas.
- `POST /api/admin/cientistas`: cria aprovada.
- `PUT /api/admin/cientistas/:id`: atualiza.
- `DELETE /api/admin/cientistas/:id`: exclui.
- `GET /api/admin/sugestoes`: lista pendentes.
- `PATCH /api/admin/sugestoes/:id`: aprova/recusa com `{ "status": "aprovada" }` ou `{ "status": "rejeitada" }`.

Rotas `/api/admin/*` exigem `Authorization: Bearer <ADMIN_TOKEN>`.

**Observação de segurança:** o uso de token compartilhado é uma solução simples para demonstração acadêmica, e não um sistema de autenticação de produção. Para um deploy público, implementar contas, senhas seguras, rate limiting e auditoria antes de abrir o painel.

## Documentação do ponto de controle

- [Relatório de implementação, evidências e pendências](docs/ENTREGA_PONTO_DE_CONTROLE.md)
- [Roteiro de testes real de ponta a ponta](docs/ROTEIRO_TESTE_MANUAL.md)
- [Texto pronto para o card do Trello](docs/RESUMO_PARA_TRELLO.md)

**Status de validação:** 23 testes automatizados de lógica/contrato passaram. Ainda é necessário executar o sistema com MySQL real, concluir os testes no navegador, verificar o feedback dos professores e integrar as alterações ao Git oficial. Consulte o relatório antes de marcar o card como Done.
