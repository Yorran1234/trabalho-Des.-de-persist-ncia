const Professores = require('../models/professores');

// Controlador para gerenciar professores
const professoresController = {
  // Criar um novo professor
  create: (req, res) => {
    const { nome, email, disciplina } = req.body;

    if (!nome || !email || !disciplina) {
      return res.status(400).send('Os campos nome, email e disciplina são obrigatórios.');
    }

    Professores.create(nome, email, disciplina, (err, result) => {
      if (err) {
        console.error('Erro ao inserir professor:', err);
        res.status(500).send('Erro ao inserir professor.');
      } else {
        res.status(201).send('Professor inserido com sucesso.');
      }
    });
  },

  // Alterar um professor existente
  update: (req, res) => {
    const { id } = req.params;
    const { nome, email, disciplina } = req.body;

    if (!nome || !email || !disciplina) {
      return res.status(400).send('Os campos nome, email e disciplina são obrigatórios.');
    }

    Professores.update(id, nome, email, disciplina, (err, result) => {
      if (err) {
        console.error('Erro ao alterar professor:', err);
        res.status(500).send('Erro ao alterar professor.');
      } else {
        res.send('Professor alterado com sucesso.');
      }
    });
  },

  // Excluir um professor
  delete: (req, res) => {
    const { id } = req.params;

    Professores.delete(id, (err, result) => {
      if (err) {
        console.error('Erro ao excluir professor:', err);
        res.status(500).send('Erro ao excluir professor.');
      } else {
        res.send('Professor excluído com sucesso.');
      }
    });
  },

  // Pesquisar todos os professores
  findAll: (req, res) => {
    Professores.findAll((err, results) => {
      if (err) {
        console.error('Erro ao pesquisar professores:', err);
        res.status(500).send('Erro ao pesquisar professores.');
      } else {
        res.json(results);
      }
    });
  }
};

module.exports = professoresController;
