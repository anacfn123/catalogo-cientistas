const service = require('../services/cientistaService');

async function listar(req, res) {
  const { busca, area } = req.query;
  res.json(await service.listar({ busca, areaId: area }));
}

async function detalhar(req, res) {
  res.json(await service.detalhar(req.params.id));
}

async function sugerir(req, res) {
  res.status(201).json(await service.sugerir(req.body));
}

async function listarAdmin(req, res) {
  res.json(await service.listarAdmin(req.query.status));
}

async function listarSugestoes(req, res) {
  res.json(await service.listarAdmin('pendente'));
}

async function criar(req, res) {
  res.status(201).json(await service.criar(req.body));
}

async function atualizar(req, res) {
  res.json(await service.atualizar(req.params.id, req.body));
}

async function excluir(req, res) {
  res.json(await service.excluir(req.params.id));
}

async function revisar(req, res) {
  res.json(await service.revisarSugestao(req.params.id, req.body?.status));
}

module.exports = { listar, detalhar, sugerir, listarAdmin, listarSugestoes, criar, atualizar, excluir, revisar };
