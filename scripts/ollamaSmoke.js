const { askAI } = require('../utils/ollama');

(async () => {
  const response = await askAI('Reply with: Ollama is ready for Playwright API failure analysis.');
  console.log(response);
})();
