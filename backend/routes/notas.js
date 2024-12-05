const express = require('express');
const router = express.Router();
const {
  getAlunos,
  addNota,
  updateNota,
  deleteNota,
  getNotasClickHouse,
} = require('../controllers/notas');

// Rotas de notas
router.get('/notas-clickhouse', getNotasClickHouse);
router.get('/alunos', getAlunos);
router.post('/add', addNota); // Ajuste na nomenclatura
router.put('/update', updateNota);
router.delete('/delete/:alunoId', deleteNota);

module.exports = router;
