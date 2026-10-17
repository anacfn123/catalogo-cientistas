// Routes = lista de endereços da API e qual controller atende cada um.
const { Router } = require('express');
const cientistaController = require('../controllers/cientistaController');
const areaController = require('../controllers/areaController');

const router = Router();

router.get('/cientistas', cientistaController.listar);
router.get('/cientistas/:id', cientistaController.detalhar);
router.post('/sugestoes', cientistaController.sugerir);
router.get('/areas', areaController.listar);

module.exports = router;
