export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

export class MemoryCacheService implements CacheService {
  private readonly entries = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1_000,
    });
  }

  clear(): void {
    this.entries.clear();
  }
}
