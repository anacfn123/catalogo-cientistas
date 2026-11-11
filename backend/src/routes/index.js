const { Router } = require('express');
const cientista = require('../controllers/cientistaController');
const area = require('../controllers/areaController');
const verificarAdmin = require('../middlewares/verificarAdmin');

const router = Router();
router.get('/cientistas', cientista.listar);
router.get('/cientistas/:id', cientista.detalhar);
router.post('/sugestoes', cientista.sugerir);
router.get('/areas', area.listar);

// Todas as ações administrativas exigem o token do backend.
const admin = Router();
admin.use(verificarAdmin);
admin.get('/sessao', (_req, res) => res.json({ autenticado: true }));
admin.get('/cientistas', cientista.listarAdmin);
admin.post('/cientistas', cientista.criar);
admin.put('/cientistas/:id', cientista.atualizar);
admin.delete('/cientistas/:id', cientista.excluir);
admin.get('/sugestoes', cientista.listarSugestoes);
admin.patch('/sugestoes/:id', cientista.revisar);
router.use('/admin', admin);

module.exports = router;
