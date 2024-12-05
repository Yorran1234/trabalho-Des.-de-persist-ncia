const connection = require('../config/db'); // Banco relacional (MySQL)
const { ClickHouse } = require('clickhouse'); 
const clickhouse = require('../config/clickhouse');// Banco ClickHouse
const { salvarLogNaNuvem } = require('../utils/log');

const getNotasClickHouse = async (req, res) => {
  try {
    const query = `
      SELECT 
        aluno_id,
        arrayStringConcat(arraySort(groupArray(toString(nota))), ',') AS notas
      FROM notas
      GROUP BY aluno_id
    `;

    const result = await clickhouse.query(query).toPromise();

    const notasFormatadas = result.map((row) => ({
      id: row.aluno_id,
      notas: row.notas.split(',').map(Number),
    }));

    res.status(200).json(notasFormatadas);
  } catch (error) {
    console.error('Erro ao buscar notas no ClickHouse:', error);
    res.status(500).json({ error: 'Erro ao buscar notas no ClickHouse.' });
  }
};

// Função para obter alunos
const getAlunos = async (req, res) => {
  try {
    connection.query('SELECT id, nome FROM alunos', (err, results) => {
      if (err) {
        console.error('Erro ao buscar alunos:', err);
        return res.status(500).send('Erro ao buscar alunos.');
      }
      res.json(results); // Retorna apenas os dados do MySQL
    });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).send('Erro ao buscar alunos.');
  }
};


// Função para editar nota
const updateNota = async (req, res) => {
  const { alunoId, nota } = req.body;
  console.log('Requisição para atualizar nota recebida:', req.body);

  if (!alunoId || !nota) {
    return res.status(400).send('Aluno e Nota são obrigatórios.');
  }

  // Verificar se o aluno existe no MySQL
  connection.query('SELECT nome FROM alunos WHERE id = ?', [alunoId], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      return res.status(500).send('Erro ao buscar aluno.');
    }

    if (results.length === 0) {
      console.error('Aluno não encontrado:', alunoId);
      return res.status(404).send('Aluno não encontrado.');
    }

    const nomeAluno = results[0].nome;

    // Atualizar a nota no ClickHouse
    try {
      const query = `
        ALTER TABLE notas
        UPDATE nota = ${nota}
        WHERE aluno_id = ${alunoId}
      `;
      await clickhouse.query(query).toPromise();

      console.log(`Nota atualizada com sucesso para o aluno ${nomeAluno}`);
      res.status(200).send('Nota atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar nota no ClickHouse:', error);
      res.status(500).send('Erro ao atualizar nota.');
    }
  });
};


// Função para adicionar nota
// Função para adicionar nota
const addNota = async (req, res) => {
  const { alunoId, nota } = req.body;

  if (!alunoId || nota == null) {
    return res.status(400).json({ error: 'Aluno e Nota são obrigatórios.' });
  }

  try {
    const queryInsert = `
      INSERT INTO notas (aluno_id, nota)
      VALUES (${alunoId}, ${nota})
    `;
    await clickhouse.query(queryInsert).toPromise();

    // Salva o log no Google Cloud Storage
    const logMessage = `Nota inserida: ${nota}, ID do aluno: ${alunoId}`;
    salvarLogNaNuvem(logMessage);

    res.status(201).json({ message: 'Nota adicionada com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar nota no ClickHouse:', error);
    res.status(500).json({ error: 'Erro ao adicionar nota.' });
  }
};


const deleteNota = async (req, res) => {
  const { alunoId } = req.params; // O ID do aluno será enviado na URL
  console.log('Requisição para excluir nota recebida:', alunoId);

  if (!alunoId) {
    return res.status(400).send('ID do aluno é obrigatório.');
  }

  // Verificar se o aluno existe no MySQL
  connection.query('SELECT nome FROM alunos WHERE id = ?', [alunoId], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      return res.status(500).send('Erro ao buscar aluno.');
    }

    if (results.length === 0) {
      console.error('Aluno não encontrado:', alunoId);
      return res.status(404).send('Aluno não encontrado.');
    }

    const nomeAluno = results[0].nome;

    // Excluir a nota do ClickHouse
    try {
      const query = `
        ALTER TABLE notas
        DELETE WHERE aluno_id = ${alunoId}
      `;
      await clickhouse.query(query).toPromise();

      console.log(`Nota excluída com sucesso para o aluno ${nomeAluno}`);
      res.status(200).send('Nota excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir nota no ClickHouse:', error);
      res.status(500).send('Erro ao excluir nota.');
    }
  });
};
module.exports = {
  getAlunos,
  addNota,
  updateNota,
  deleteNota,
  getNotasClickHouse, // Adiciona a nova função ao export
};
