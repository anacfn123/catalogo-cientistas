// Controller = recebe a requisição HTTP, chama o service e devolve a resposta.
const service = require('../services/cientistaService');

async function listar(req, res) {
  const { busca, area } = req.query; // ex.: /api/cientistas?busca=maria&area=2
  const cientistas = await service.listar({ busca, areaId: area });
  res.json(cientistas);
}

async function detalhar(req, res) {
  const cientista = await service.detalhar(Number(req.params.id));
  res.json(cientista);
}

async function sugerir(req, res) {
  const resultado = await service.sugerir(req.body);
  res.status(201).json(resultado);
}

module.exports = { listar, detalhar, sugerir };
