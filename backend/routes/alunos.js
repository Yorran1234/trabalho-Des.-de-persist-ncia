const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunos');

router.post('/', alunosController.create);
router.put('/:id', alunosController.update);
router.delete('/:id', alunosController.delete);
router.get('/', alunosController.findAll);

module.exports = router;
