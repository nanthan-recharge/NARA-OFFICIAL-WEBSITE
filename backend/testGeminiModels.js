const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyD1fb8vPW6MkEtAt_tK2OGKLqPZu-z6FAE';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // Try to generate content with different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}: ${text.substring(0, 50)}...\n`);
        break; // Stop on first success
      } catch (error) {
        console.log(`❌ FAILED with ${modelName}: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
