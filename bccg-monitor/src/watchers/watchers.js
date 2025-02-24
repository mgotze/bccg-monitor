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
