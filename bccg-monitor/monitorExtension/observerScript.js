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
