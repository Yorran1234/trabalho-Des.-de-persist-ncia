const express = require('express');
const router = express.Router();
const { getAlunos, addNota, updateNota, deleteNota, getAlunosComNotas } = require('../controllers/notas');

// Rota para obter alunos com notas do ClickHouse
router.get('/alunos-com-notas', getAlunosComNotas);

// Outras rotas existentes
router.get('/alunos', getAlunos);
router.post('/', addNota);
router.put('/', updateNota);
router.delete('/:alunoId', deleteNota);

module.exports = router;
