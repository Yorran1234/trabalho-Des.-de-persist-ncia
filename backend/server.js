const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para lidar com JSON e CORS
app.use(cors());
app.use(express.json());

// Rotas importadas
const professoresRoutes = require('./routes/professores');
const alunosRoutes = require('./routes/alunos'); // Rota de alunos
const notasRoutes = require('./routes/notas');  // Rota de notas

// Definindo prefixos para as rotas
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
app.use('/notas', notasRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Inicializando o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
