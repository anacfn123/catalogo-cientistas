# Roteiro de validação ponta a ponta (executar antes da apresentação)

Marque cada item com `[x]` após conferir com o MySQL e o site ligados. **Nenhum destes casos foi marcado como executado** neste ambiente.

## Preparação

- [ ] Subir MySQL com schema e seed em **banco descartável**. Cuidado: o schema contém `DROP TABLE` e o seed não foi feito para ser rodado repetidamente.
- [ ] Criar `backend/.env` (dados reais e `ADMIN_TOKEN` forte com mínimo 16 caracteres); validar `GET /api/health` com `banco: ok`.
- [ ] Executar `npm ci` no frontend/backend com Node >= 22.22; `npm run build`, `npm run lint`, `npm test`.
- [ ] Iniciar backend com `npm run dev` e frontend com `npm run dev`.
- [ ] Executar o teste real de API `cd backend && node --env-file=.env test/fluxoE2E.mjs`; deve terminar com `PASSOU` e remover os registros temporários.

## Visitante sem login

- [ ] Abrir `/`: conferir título, cards de destaque, layout e busca.
- [ ] Pesquisar cientista conhecida na home e verificar URL, resultados e perfil.
- [ ] Pesquisar por nome no catálogo; pesquisar por nome de área (ex.: Biologia).
- [ ] Selecionar uma área e confirmar apenas cientistas daquela área.
- [ ] Combinar busca + filtro; limpar busca/filtro; testar resultado vazio.
- [ ] Abrir perfil de cientista aprovada: nome, biografia, áreas, prêmios, contribuições e publicações. Testar perfil inexistente (`/cientistas/999999`).
- [ ] Abrir `/sugerir`, enviar sugestão com nome, biografia, ano início, dados do solicitante; ver confirmação e registro pendente no admin.
- [ ] Enviar e-mail inválido ou ano de término anterior ao inicial; confirmar validação/erro, sem salvar registro inválido.
- [ ] Testar `/sobre`, links do cabeçalho/rodapé, navegação e rota inexistente.

## Administração

- [ ] Abrir `/admin` sem token e verificar exigência de credencial.
- [ ] Tentar token inválido: acesso negado (401); inserir token correto, verificar listagem.
- [ ] Cadastrar cientista com nome, biografia, início/término e áreas; conferir no admin e no catálogo.
- [ ] Editar nome, biografia, anos e áreas; conferir atualização no admin, na listagem e no perfil.
- [ ] Excluir cientista recém-criada, confirmar ação; conferir que sumiu do catálogo e perfil retorna 404.
- [ ] Abrir aba Sugestões; conferir nova pendente e dados do solicitante visíveis apenas para admin.
- [ ] Aprovar uma pendente; conferir que saiu da fila e passou a aparecer no site público.
- [ ] Recusar outra pendente; conferir que saiu da fila e **não** aparece no público.
- [ ] Confirmar que sugestão já analisada não aceita uma segunda decisão (HTTP 409).
- [ ] Editar uma sugestão antes de aprovar; confirmar persistência dos dados alterados.
- [ ] Clicar Sair; recarregar `/admin`, validar que precisa autenticar novamente.

## Resiliência, responsividade e integração

- [ ] Com backend desligado, abrir home, catálogo, perfil e sugestão e conferir mensagem clara de erro (sem página em branco).
- [ ] Revisar apresentação em celular (largura 375 px), tablet e desktop; navegação, filtros, formulário e botões sem cortes.
- [ ] Inspecionar console do navegador: sem erros React, CORS, warnings críticos ou requisições HTTP não tratadas.
- [ ] Executar testes com banco de teste restaurado após operações de exclusão.
- [ ] Conferir com colegas os pontos pendentes e evidências (capturas da tela/resultado de comandos, se necessário).

## Git e entrega em equipe

- [ ] No repositório original, executar `git status`, `git branch --show-current`, `git log --format='%an <%ae>' --all` e conferir autoria de todos os membros.
- [ ] Revisar diferenças, fazer commit/push em branch de trabalho, abrir PR e integrar em `main` (ou seguir workflow da equipe).
- [ ] Verificar `git status` limpo, `git log --oneline -5` e pipeline da branch principal.
- [ ] Registrar pendências reais em “Won't”/realinhamento, se a equipe decidir não entregá-las.

**Importante:** não comitar o arquivo `.env` nem compartilhar `ADMIN_TOKEN` por Trello.
