// ============================================
// Cache Service - Redis Integration
// ============================================
// Caches AI responses for 24 hours to save API calls
// and improve response time

const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  /**
   * Initialize Redis connection
   */
  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isReady = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isReady = true;
      });

      await this.client.connect();
      
    } catch (error) {
      console.error('Redis Connection Error:', error);
      this.isReady = false;
      // Continue without cache if Redis fails
      console.log('⚠️  Running without cache');
    }
  }

  /**
   * Get cached value
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    if (!this.isReady) return null;
    
    try {
      const value = await this.client.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Cache Get Error:', error);
      return null;
    }
  }

  /**
   * Set cached value
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default 24 hours)
   */
  async set(key, value, ttl = 86400) {
    if (!this.isReady) return;
    
    try {
      await this.client.setEx(
        key,
        ttl,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error('Cache Set Error:', error);
    }
  }

  /**
   * Delete cached value
   * @param {string} key - Cache key
   */
  async delete(key) {
    if (!this.isReady) return;
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache Delete Error:', error);
    }
  }

  /**
   * Generate cache key for career advice
   * @param {string} question - User's question
   * @returns {string} Cache key
   */
  generateCareerAdviceKey(question) {
    // Create simple hash of question for cache key
    const normalized = question.toLowerCase().trim();
    return `career:${Buffer.from(normalized).toString('base64').slice(0, 50)}`;
  }

  /**
   * Generate cache key for resume review
   * @param {string} resumeText - Resume content
   * @returns {string} Cache key
   */
  generateResumeKey(resumeText) {
    // Use first 200 chars to create key
    const snippet = resumeText.slice(0, 200).toLowerCase().trim();
    return `resume:${Buffer.from(snippet).toString('base64').slice(0, 50)}`;
  }

  /**
   * Generate cache key for skill gap
   * @param {Array} skills - Current skills
   * @param {string} targetRole - Target role
   * @returns {string} Cache key
   */
  generateSkillGapKey(skills, targetRole) {
    const key = `${skills.sort().join(',')}_${targetRole}`;
    return `skillgap:${Buffer.from(key).toString('base64').slice(0, 50)}`;
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis disconnected');
    }
  }
}

module.exports = new CacheService();
