const connection = require('../config/db');

const Professores = {
  // Inserir um novo professor
  create: (nome, email, disciplina, callback) => {
    const sql = 'INSERT INTO professores (nome, email, disciplina) VALUES (?, ?, ?)';
    connection.query(sql, [nome, email, disciplina], callback);
  },

  // Alterar um professor existente
  update: (id, nome, email, disciplina, callback) => {
    const sql = 'UPDATE professores SET nome = ?, email = ?, disciplina = ? WHERE id = ?';
    connection.query(sql, [nome, email, disciplina, id], callback);
  },

  // Excluir um professor
  delete: (id, callback) => {
    const sql = 'DELETE FROM professores WHERE id = ?';
    connection.query(sql, [id], callback);
  },

  // Pesquisar todos os professores
  findAll: (callback) => {
    const sql = 'SELECT * FROM professores';
    connection.query(sql, callback);
  }
};

module.exports = Professores;
