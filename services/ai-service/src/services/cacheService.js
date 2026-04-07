// ============================================
// Cache Service - Redis with in-memory fallback
// ============================================
// Uses Redis when REDIS_URL is set; falls back to a Map-based
// in-memory cache so the service works without Redis.

class CacheService {
  constructor() {
    this.client = null;
    this.isReady = false;
    // In-memory fallback: stores { value, expiresAt }
    this.memCache = new Map();
  }

  /**
   * Initialize Redis connection (no-op if REDIS_URL is absent).
   */
  async connect() {
    if (!process.env.REDIS_URL) {
      console.log('ℹ️  REDIS_URL not set — using in-memory cache');
      return;
    }

    try {
      const redis = require('redis');
      this.client = redis.createClient({ url: process.env.REDIS_URL });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err.message);
        this.isReady = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isReady = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Redis Connection Error:', error.message);
      console.log('⚠️  Falling back to in-memory cache');
      this.client = null;
      this.isReady = false;
    }
  }

  // ── Internal helpers ───────────────────────────────────────────

  _memGet(key) {
    const entry = this.memCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.memCache.delete(key);
      return null;
    }
    return entry.value;
  }

  _memSet(key, value, ttl) {
    this.memCache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
  }

  _memDelete(key) {
    this.memCache.delete(key);
  }

  // ── Public API ─────────────────────────────────────────────────

  async get(key) {
    if (this.isReady) {
      try {
        const raw = await this.client.get(key);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error('Cache Get Error:', err.message);
        return null;
      }
    }
    return this._memGet(key);
  }

  async set(key, value, ttl = 86400) {
    if (this.isReady) {
      try {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      } catch (err) {
        console.error('Cache Set Error:', err.message);
      }
      return;
    }
    this._memSet(key, value, ttl);
  }

  async delete(key) {
    if (this.isReady) {
      try {
        await this.client.del(key);
      } catch (err) {
        console.error('Cache Delete Error:', err.message);
      }
      return;
    }
    this._memDelete(key);
  }

  // ── Key generators (unchanged) ─────────────────────────────────

  generateCareerAdviceKey(question) {
    const normalized = question.toLowerCase().trim();
    return `career:${Buffer.from(normalized).toString('base64').slice(0, 50)}`;
  }

  generateResumeKey(resumeText) {
    const snippet = resumeText.slice(0, 200).toLowerCase().trim();
    return `resume:${Buffer.from(snippet).toString('base64').slice(0, 50)}`;
  }

  generateSkillGapKey(skills, targetRole) {
    const key = `${skills.sort().join(',')}_${targetRole}`;
    return `skillgap:${Buffer.from(key).toString('base64').slice(0, 50)}`;
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis disconnected');
    }
  }
}

module.exports = new CacheService();
