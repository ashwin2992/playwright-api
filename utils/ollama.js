const axios = require('axios');
const logger = require('./logger');

async function askAI(prompt) {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const timeout = Number(process.env.OLLAMA_TIMEOUT_MS || 280000);
   
   logger.info("Calling Ollama...");
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, '')}/api/generate`,
      {
        model: process.env.OLLAMA_MODEL || 'qwen2.5:3b',
        prompt,
        stream: false,
        options: {
          num_predict: Number(process.env.OLLAMA_NUM_PREDICT || 350),
          temperature: Number(process.env.OLLAMA_TEMPERATURE || 0.2)
        }
      },
      { timeout }
    );

    return response.data.response || 'Ollama returned an empty analysis.';
logger.info("Ollama response received.");
  } catch (error) {
    logger.warn(`Ollama analysis unavailable: ${error.message}`);
    return [
      `Ollama analysis unavailable: ${error.message}`,
      '',
      'Quick fallback:',
      '- Confirm Ollama is running with `ollama serve`.',
      '- Confirm the model is available with `ollama list`.',
      '- Increase `OLLAMA_TIMEOUT_MS` or use a smaller/faster model in `.env`.'
    ].join('\n');
  }
}

module.exports = { askAI };
