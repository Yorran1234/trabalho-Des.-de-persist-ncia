const connection = require('../config/db');

const Alunos = {
  create: (nome,  email, callback) => {
    const sql = 'INSERT INTO alunos (nome, email) VALUES (?, ?)';
    connection.query(sql, [nome,  email], callback);
  },

  update: (id, nome, email, callback) => {
    const sql = 'UPDATE alunos SET nome = ?,  email = ? WHERE id = ?';
    connection.query(sql, [nome,  email, id], callback);
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
