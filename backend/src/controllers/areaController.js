const areaRepository = require('../repositories/areaRepository');

async function listar(req, res) {
  const areas = await areaRepository.listar();
  res.json(areas.map((a) => ({ id: a.id_area, nome: a.nome_area })));
}

module.exports = { listar };
