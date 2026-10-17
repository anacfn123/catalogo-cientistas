// Ponto de entrada do backend.
require('dotenv').config(); // lê o arquivo .env antes de tudo

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const rotas = require('./routes');
const tratarErros = require('./middlewares/tratarErros');

const app = express();
app.use(cors());          // permite o React (outra porta) chamar a API
app.use(express.json());  // permite receber JSON no corpo das requisições

// Rota de teste: confirma se o backend consegue falar com o banco.
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ api: 'ok', banco: 'ok' });
  } catch (erro) {
    res.status(500).json({ api: 'ok', banco: 'erro', detalhe: erro.message });
  }
});

app.use('/api', rotas);
app.use(tratarErros); // sempre por último

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
