erver.jsconst express = require('express');
const app = express();
const port = 3000;

// Permite que o Express parse requisições em JSON:
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API da BCGame Crash - Online');
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});


const CrashResult = require('./CrashResult');

// (dentro do app.listen, antes de iniciar o servidor)
CrashResult.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado');
    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('Erro ao sincronizar banco: ', err));


app.post('/api/crash-results', async (req, res) => {
  try {
    // Dados enviados pela extensão
    const { roundId, crashPoint } = req.body;

    // Cria novo registro no banco
    const result = await CrashResult.create({
      roundId,
      crashPoint
    });

    return res.status(201).json({
      message: 'Resultado salvo com sucesso',
      data: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao salvar resultado' });
  }
});
