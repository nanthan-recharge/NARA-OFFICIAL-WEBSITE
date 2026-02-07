const logger = require('../config/logger');

class RetryStrategy {
  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 30000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  async execute(fn, context = '') {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries) {
          logger.error(`${context} Failed after ${attempt + 1} attempts:`, error.message);
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        logger.warn(`${context} Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await this.wait(delay);
      }
    }
    throw lastError;
  }

  calculateDelay(attempt) {
    const exponentialDelay = Math.pow(2, attempt) * this.baseDelay;
    const delayWithJitter = exponentialDelay * (0.5 + Math.random() * 0.5);
    return Math.min(Math.floor(delayWithJitter), this.maxDelay);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = RetryStrategy;

