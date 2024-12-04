const Alunos = require('../models/alunos');
const { salvarLogNaNuvem } = require('../utils/log');  // Importando a função de log

const alunosController = {
  create: (req, res) => {
    const { nome, data_nascimento, email } = req.body;

    if (!nome || !data_nascimento || !email) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Criação do aluno no banco
    Alunos.create(nome, data_nascimento, email, (err) => {
      if (err) {
        console.error('Erro ao inserir aluno:', err);
        res.status(500).send('Erro ao inserir aluno.');
      } else {
        // Criando uma mensagem de log
        const logMessage = `Novo aluno inserido: ${nome}, Nascimento: ${data_nascimento}, Email: ${email}`;

        // Salva o log no Google Cloud Storage
        salvarLogNaNuvem(logMessage);

        res.status(201).send('Aluno inserido com sucesso.');
      }
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nome, data_nascimento, email } = req.body;

    if (!nome || !data_nascimento || !email) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    Alunos.update(id, nome, data_nascimento, email, (err) => {
      if (err) {
        console.error('Erro ao atualizar aluno:', err);
        res.status(500).send('Erro ao atualizar aluno.');
      } else {
        res.send('Aluno atualizado com sucesso.');
      }
    });
  },

  delete: (req, res) => {
    const { id } = req.params;

    Alunos.delete(id, (err) => {
      if (err) {
        console.error('Erro ao excluir aluno:', err);
        res.status(500).send('Erro ao excluir aluno.');
      } else {
        res.send('Aluno excluído com sucesso.');
      }
    });
  },

  findAll: (req, res) => {
    Alunos.findAll((err, results) => {
      if (err) {
        console.error('Erro ao listar alunos:', err);
        res.status(500).send('Erro ao listar alunos.');
      } else {
        res.json(results);
      }
    });
  },
};

module.exports = alunosController;
