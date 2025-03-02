import { Level } from 'level';
import path from 'path';

class CacheService {
  // eslint-disable-next-line no-use-before-define
  private static instance: CacheService;

  private db: Level<string, unknown>;

  private isInitialized: boolean = false;

  private constructor() {
    this.db = new Level(path.resolve(__dirname, '../../../movies.leveldb'), { valueEncoding: 'json' });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      try {
        if (this.db.status !== 'open') await this.db.open();
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize cache database:', error);
        throw error;
      }
    }
  }

  async set(key: string, value: unknown, ttl: number): Promise<void> {
    await this.ensureInitialized();
    const expiresAt = Date.now() + (ttl * 1000);
    const data = JSON.stringify({ value, expiresAt });

    try {
      await this.db.put(key, data);
    } catch (error) {
      console.error(`Failed to store cache for key: ${key}`, error);
    }
  }

  async get(key: string): Promise<unknown | null> {
    await this.ensureInitialized();
    try {
      const rawData = await this.db.get(key);
      const data = JSON.parse(rawData as string);

      if (data.expiresAt && Date.now() > data.expiresAt) {
        await this.del(key);
        return null;
      }

      return data.value;
    } catch {
      return null;
    }
  }

  async del(key: string): Promise<void> {
    await this.ensureInitialized();
    try {
      await this.db.del(key);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'type' in err && err.type !== 'NotFoundError') {
        throw err;
      }
    }
  }

  async getAll(): Promise<{ key: string; value: unknown; expiresAt: string }[]> {
    await this.ensureInitialized();
    const results: { key: string; value: unknown; expiresAt: string }[] = [];

    const keys = await this.db.keys().all();
    const values = await this.db.values().all();

    keys.forEach((key, index) => {
      try {
        const parsed = JSON.parse(values[index] as string);
        results.push({
          key,
          value: JSON.stringify(parsed.value)
            .replace(/\\/g, '')
            .substring(0, 100),
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt).toLocaleString() : '∞',
        });
      } catch (error) {
        console.error(`Failed to parse cache entry for key ${key}:`, error);
      }
    });

    return results;
  }

  async destroy(): Promise<void> {
    await this.ensureInitialized();
    await this.db.clear();
  }
}

export default CacheService.getInstance();
