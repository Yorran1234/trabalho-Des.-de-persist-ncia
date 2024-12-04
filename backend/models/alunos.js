const connection = require('../config/db');

const Alunos = {
  create: (nome, data_nascimento, email, callback) => {
    const sql = 'INSERT INTO alunos (nome, data_nascimento, email) VALUES (?, ?, ?)';
    connection.query(sql, [nome, data_nascimento, email], callback);
  },

  update: (id, nome, data_nascimento, email, callback) => {
    const sql = 'UPDATE alunos SET nome = ?, data_nascimento = ?, email = ? WHERE id = ?';
    connection.query(sql, [nome, data_nascimento, email, id], callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM alunos WHERE id = ?';
    connection.query(sql, [id], callback);
  },

  findAll: (callback) => {
    const sql = 'SELECT * FROM alunos';
    connection.query(sql, callback);
  },
};

module.exports = Alunos;
