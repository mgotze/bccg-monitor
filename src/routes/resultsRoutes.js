require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const resultsRoutes = require('./src/routes/resultsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar no MongoDB:', error);
  });

// Rotas da aplicação
app.use('/api/results', resultsRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do BCGame Monitor está online!');
});

// Inicia o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
