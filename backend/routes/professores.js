const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professores');

// Definir as rotas para professores
router.post('/', professoresController.create);       // Criar professor
router.put('/:id', professoresController.update);     // Alterar professor
router.delete('/:id', professoresController.delete);  // Excluir professor
router.get('/', professoresController.findAll);       // Listar todos os professores

module.exports = router;
