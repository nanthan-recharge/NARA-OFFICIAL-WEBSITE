const axios = require('axios');

const apiKey = 'AIzaSyD1fb8vPW6MkEtAt_tK2OGKLqPZu-z6FAE';

async function listModels() {
  try {
    console.log('Fetching available models from Gemini API...\n');

    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    console.log('Available models:');
    console.log('='.repeat(60));

    if (response.data && response.data.models) {
      response.data.models.forEach(model => {
        console.log(`\nModel: ${model.name}`);
        console.log(`  Display Name: ${model.displayName || 'N/A'}`);
        console.log(`  Description: ${model.description || 'N/A'}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      });
    } else {
      console.log('No models found in response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error fetching models:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data || error.message);
  }
}

listModels();
