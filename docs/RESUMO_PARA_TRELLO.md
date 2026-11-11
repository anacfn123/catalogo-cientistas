# Sugestão de comentário para o card “Fechar as features funcionais”

Implementada no código uma tela `/admin` com listagem e cadastro/edição/exclusão de cientistas, revisão de sugestões pendentes (aprovar/recusar) e rotas protegidas por token. O backend atualiza o status na tabela `cientista`, valida os dados, usa SQL parametrizado e transações no CRUD. Corrigidos catálogo, busca por nome/área, filtro, biografia nos cards, perfil com publicações e mensagens de erro/carregamento das páginas públicas.

**Testes realizados:** 18 testes backend + 5 testes de contrato do frontend aprovados; 16 arquivos JS/JSX analisados sem erros de sintaxe. **Não testado ainda:** fluxo real com MySQL e navegador, lint/build com dependências instaladas. Teste E2E automatizado e checklist manual adicionados para execução local.

**Pendências a validar com a equipe:** consultar feedback real dos professores e itens dependentes do Trello; concluir validação E2E e visual; aplicar mudanças no repositório oficial, fazer merge em `main` e conferir autores dos commits. O ZIP enviado não inclui `.git` e não houve acesso direto ao Trello/Git remoto; não marcar todos os critérios do card como concluídos até essas conferências.

Documentação completa em `docs/ENTREGA_PONTO_DE_CONTROLE.md`; roteiro em `docs/ROTEIRO_TESTE_MANUAL.md`.
