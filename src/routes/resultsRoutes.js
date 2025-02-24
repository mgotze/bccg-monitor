const express = require('express');
const router = express.Router();
const Result = require('../models/resultModel');

// POST - Salvar um novo resultado
router.post('/', async (req, res) => {
  try {
    const { crashPoint } = req.body;
    if (crashPoint == null) {
      return res.status(400).json({ error: 'É necessário fornecer crashPoint.' });
    }

    const newResult = new Result({ crashPoint });
    await newResult.save();

    return res.status(201).json({
      message: 'Resultado salvo com sucesso!',
      result: newResult
    });
  } catch (err) {
    console.error('Erro ao salvar resultado:', err);
    return res.status(500).json({ error: 'Erro interno ao salvar resultado.' });
  }
});

// GET - Listar todos os resultados
router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ timestamp: -1 });
    return res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar resultados:', err);
    return res.status(500).json({ error: 'Erro interno ao buscar resultados.' });
  }
});

module.exports = router;
