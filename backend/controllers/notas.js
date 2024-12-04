const connection = require('../config/db'); // Banco relacional (MySQL)
const { ClickHouse } = require('clickhouse'); // Banco ClickHouse

// Configuração do cliente ClickHouse
const clickhouse = new ClickHouse({
  url: 'http://localhost:8123',
  port: 8123,
  protocol: 'http',
  database: 'adicionar_notas',
});
const getAlunosComNotas = async (req, res) => {
  try {
    // Primeiro, busque os alunos no MySQL
    connection.query('SELECT id, nome FROM alunos', async (err, alunos) => {
      if (err) {
        console.error('Erro ao buscar alunos no MySQL:', err);
        return res.status(500).send('Erro ao buscar alunos no MySQL.');
      }

      // Segundo, busque as notas no ClickHouse
      const queryNotas = `
        SELECT 
          aluno_id, 
          arrayStringConcat(arraySort(groupArray(nota))) AS notas
        FROM notas
        GROUP BY aluno_id
      `;

      const notasResult = await clickhouse.query(queryNotas).toPromise();

      console.log('Notas do ClickHouse:', notasResult.data); // Para verificar o retorno das notas

      // Crie um mapa de aluno_id para as notas
      const notasMap = notasResult.data.reduce((acc, item) => {
        acc[item.aluno_id] = item.notas ? item.notas.split(',').map(Number) : [];
        return acc;
      }, {});

      // Combine os alunos do MySQL com as notas do ClickHouse
      const alunosComNotas = alunos.map((aluno) => ({
        id: aluno.id,
        nome: aluno.nome,
        notas: notasMap[aluno.id] || [], // Adiciona as notas ou um array vazio
      }));

      console.log('Alunos com notas:', alunosComNotas); // Para verificar o formato final
      res.json(alunosComNotas);
    });
  } catch (error) {
    console.error('Erro ao buscar alunos com notas:', error);
    res.status(500).send('Erro ao buscar alunos com notas.');
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
const addNota = async (req, res) => {
  const { alunoId, nota } = req.body;

  if (!alunoId || nota == null) {
    return res.status(400).send('Aluno e Nota são obrigatórios.');
  }

  try {
    // Inserir a nova nota
    const queryInsert = `
      INSERT INTO notas (aluno_id, nota) VALUES (${alunoId}, ${nota})
    `;
    await clickhouse.query(queryInsert).toPromise();

    res.status(201).send('Nota adicionada com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar nota:', error);
    res.status(500).send('Erro ao adicionar nota.');
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
  getAlunosComNotas, // Adiciona a nova função ao export
};
