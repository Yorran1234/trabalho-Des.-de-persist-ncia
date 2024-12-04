const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para lidar com JSON e CORS
app.use(cors());
app.use(express.json());

// Importando as rotas
const professoresRoutes = require('./routes/professores');
const alunosRoutes = require('./routes/alunos');  // Rota de alunos
const notasRoutes = require('./routes/notas');   // Rota de notas

// Definindo prefixos para rotas
app.use('/professores', professoresRoutes);
app.use('/alunos', alunosRoutes);
app.use('/notas', notasRoutes);

// Inicializando o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
