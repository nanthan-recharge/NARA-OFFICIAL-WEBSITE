const { VertexAI } = require('@google-cloud/vertexai');
const pRetry = require('p-retry');
const config = require('../config');
const logger = require('../config/logger');
const { CATEGORY_KEYWORDS } = require('../utils/categoryMap');

const SYSTEM_PROMPT = `You are the NARA Digital Ocean newsroom assistant. You classify Sri Lankan marine and fisheries news articles into one of the allowed categories, summarise them in 3 sentences, extract up to 4 bullet key points, and translate the title and summary into Sinhala and Tamil. The allowed categories are: ${Object.keys(CATEGORY_KEYWORDS).join(', ')}. Return strict JSON.`;

class GeminiService {
  constructor() {
    this.vertexAI = new VertexAI({
      project: config.vertex.projectId,
      location: config.vertex.location
    });
    this.model = this.vertexAI.getGenerativeModel({
      model: config.vertex.model
    });
    this.generationConfig = {
      temperature: 0.2,
      topP: 0.9,
      topK: 32,
      maxOutputTokens: 2048
    };
    this.safetySettings = config.vertex.safetyCategory
      ? [
          {
            category: config.vertex.safetyCategory,
            threshold: config.vertex.safetyThreshold
          }
        ]
      : undefined;
    this.targetLanguages = config.translations.languages;
  }

  async generate(content) {
    const request = {
      contents: [
        {
          role: 'system',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: 'user',
          parts: [
            {
              text: JSON.stringify(content)
            }
          ]
        }
      ],
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings
    };

    const run = async () => {
      const response = await this.model.generateContent(request);
      const candidates = response?.response?.candidates || [];
      if (!candidates.length) {
        throw new Error('Gemini returned no candidates');
      }
      const text = candidates
        .flatMap(candidate => candidate.content?.parts || [])
        .map(part => part.text)
        .filter(Boolean)
        .join('\n');

      if (!text) {
        throw new Error('Gemini returned empty response');
      }

      try {
        return JSON.parse(text);
      } catch (error) {
        logger.error({ text }, 'Failed to parse Gemini response as JSON');
        throw new Error('Gemini output parsing failed');
      }
    };

    return pRetry(run, {
      retries: 2,
      onFailedAttempt: error => {
        logger.warn(
          {
            attempt: error.attemptNumber,
            retriesLeft: error.retriesLeft
          },
          'Gemini request failed, retrying'
        );
      }
    });
  }

  async enrichArticle(article) {
    try {
      const payload = {
        article,
        targetLanguages: this.targetLanguages
      };
      const enriched = await this.generate(payload);

      return {
        summary: enriched.summary,
        category: enriched.category,
        keyPoints: enriched.keyPoints || [],
        tags: enriched.tags || [],
        translations: enriched.translations || {}
      };
    } catch (error) {
      logger.error({ err: error }, 'Gemini enrichment failed');
      throw error;
    }
  }
}

module.exports = new GeminiService();
