#!/usr/bin/env bash

# -------------------------------------------------------------------
# Script para criar a estrutura completa do projeto bccg-monitor
# (API em Node.js com Express e MongoDB) de forma automatizada.
# -------------------------------------------------------------------

# 1. Criar pasta principal do projeto (se ainda não existir).
PROJECT_DIR="bccg-monitor"

if [ ! -d "$PROJECT_DIR" ]; then
  mkdir "$PROJECT_DIR"
fi

cd "$PROJECT_DIR" || exit 1

echo "Criando estrutura do projeto em $(pwd)..."

# 2. Inicializar um package.json mínimo (caso não exista).
#    Obs: O -y aceita defaults sem perguntar.
if [ ! -f "package.json" ]; then
  npm init -y
fi

# 3. Criar arquivo .gitignore
cat <<EOL > .gitignore
node_modules/
.env
EOL

echo "Arquivo .gitignore criado."

# 4. Sobrescrever o package.json com conteúdo personalizado.
cat <<EOL > package.json
{
  "name": "bccg-monitor",
  "version": "1.0.0",
  "description": "Monitoramento do jogo Crash da BCGame em Node.js + MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.3.4",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^6.9.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
EOL

echo "Arquivo package.json criado."

# 5. Criar o arquivo server.js
cat <<'EOL' > server.js
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

// Inicia servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
EOL

echo "Arquivo server.js criado."

# 6. Criar diretórios internos
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/watchers
mkdir -p monitorExtension

# 7. Criar o modelo resultModel.js
cat <<'EOL' > src/models/resultModel.js
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    crashPoint: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Result', ResultSchema);
EOL

echo "Arquivo src/models/resultModel.js criado."

# 8. Criar as rotas resultsRoutes.js
cat <<'EOL' > src/routes/resultsRoutes.js
const express = require('express');
const router = express.Router();
const Result = require('../models/resultModel');

// POST - Salvar um novo resultado
router.post('/', async (req, res) => {
  try {
    const { crashPoint } = req.body;
    if (crashPoint == null) {
      return res.status(400).json({ error: 'É necessário fornecer crashPoint.' });
    }

    const newResult = new Result({ crashPoint });
    await newResult.save();

    return res.status(201).json({
      message: 'Resultado salvo com sucesso!',
      result: newResult
    });
  } catch (err) {
    console.error('Erro ao salvar resultado:', err);
    return res.status(500).json({ error: 'Erro interno ao salvar resultado.' });
  }
});

// GET - Listar todos os resultados
router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ timestamp: -1 });
    return res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar resultados:', err);
    return res.status(500).json({ error: 'Erro interno ao buscar resultados.' });
  }
});

module.exports = router;
EOL

echo "Arquivo src/routes/resultsRoutes.js criado."

# 9. Criar watchers.js (opcional)
cat <<'EOL' > src/watchers/watchers.js
// watchers.js
// Este arquivo pode ser usado para lógica de observação caso deseje rodar via Node.
// Exemplo fictício:

const axios = require('axios');

async function monitorCrashData() {
  try {
    // Supondo que queira enviar um valor simulado a cada chamada:
    const crashPoint = 2.34; // valor de exemplo
    await axios.post('http://localhost:3000/api/results', { crashPoint });
    console.log('CrashPoint enviado:', crashPoint);
  } catch (err) {
    console.error('Erro no monitorCrashData:', err);
  }
}

// Exemplo de execução a cada 10 segundos
setInterval(monitorCrashData, 10000);

module.exports = { monitorCrashData };
EOL

echo "Arquivo src/watchers/watchers.js criado."

# 10. Criar script de exemplo para extensão (monitorExtension/observerScript.js)
cat <<'EOL' > monitorExtension/observerScript.js
// observerScript.js
// Exemplo de script para capturar o valor do Crash no site da BCGame e enviar para a API local.

function getCrashPointFromDOM() {
  // Ajuste o seletor para o que realmente está no site.
  // Exemplo:
  // let value = document.querySelector('.crash-point').innerText;
  // return parseFloat(value);
  
  // Valor simulado para exemplo
  return 2.45;
}

// Função para enviar crashPoint ao servidor local
async function sendCrashPoint(crashPoint) {
  try {
    const response = await fetch('http://localhost:3000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crashPoint })
    });
    const data = await response.json();
    console.log('Resposta do servidor:', data);
  } catch (err) {
    console.error('Erro ao enviar crashPoint:', err);
  }
}

// Observador que roda periodicamente para capturar e enviar o valor
setInterval(() => {
  const crashPoint = getCrashPointFromDOM();
  if (crashPoint) {
    console.log('Crash capturado:', crashPoint);
    sendCrashPoint(crashPoint);
  }
}, 5000);
EOL

echo "Arquivo monitorExtension/observerScript.js criado."

# 11. Criar um .env.example (para o usuário renomear manualmente)
cat <<EOL > .env.example
PORT=3000
MONGO_URI=mongodb://localhost:27017/bccg_db
EOL

echo "Arquivo .env.example criado (renomeie para .env e ajuste conforme necessário)."

# 12. Instalar as dependências
echo "Instalando dependências NPM..."
npm install

echo "-----------------------------------------"
echo "Estrutura do projeto criada com sucesso!"
echo "Agora, para rodar em modo desenvolvimento:"
echo "  1) Renomeie .env.example para .env e ajuste se quiser."
echo "  2) Execute: npm run dev"
echo "  Ou para modo produção: npm start"
echo "-----------------------------------------"
