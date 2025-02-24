// content.js

(function() {
  // Seleciona o elemento que contém o crash point (exemplo fictício).
  const targetNode = document.querySelector('.crash-game-container');

  if (!targetNode) {
    console.log('Crash Observer: elemento não encontrado');
    return;
  }

  // Configura o MutationObserver:
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // Verifica se houve mudança no elemento que mostra o resultado final
      if (mutation.type === 'childList') {
        // Aqui você precisa identificar exatamente o nó que contém o valor do Crash
        const crashValueElement = targetNode.querySelector('.crash-point');
        const roundIdElement = targetNode.querySelector('.round-id');

        if (crashValueElement && roundIdElement) {
          const crashPoint = parseFloat(crashValueElement.innerText);
          const roundId = roundIdElement.innerText;
          if (!isNaN(crashPoint)) {
            console.log(`Crash Observer - Round: ${roundId}, Ponto: ${crashPoint}`);
            
            // Envia via fetch para a API local
            fetch('http://localhost:3000/api/crash-results', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                roundId,
                crashPoint
              })
            })
            .then(response => response.json())
            .then(data => {
              console.log('Dados enviados para a API:', data);
            })
            .catch(err => {
              console.error('Erro ao enviar para API:', err);
            });
          }
        }
      }
    });
  });

  // Configura que tipos de mudanças observar
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
})();
