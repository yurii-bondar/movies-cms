import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import CacheService from '../services/cache.service';
import parseJsonFields from '../helpers/parseJsonFields';

export function cache(ttl: number = 60): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cacheKey = req.originalUrl;
    let cachedResponse = await CacheService.get(cacheKey);

    if (cachedResponse) {
      cachedResponse = parseJsonFields(cachedResponse);
      res.json(cachedResponse);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      const cacheData = body?.dataValues ?? body;

      CacheService
        .set(cacheKey, cacheData, ttl)
        .catch((error) => {
          console.error(`Failed to cache response for ${cacheKey}:`, error);
        });

      return originalJson(body);
    };

    next();
  };
}
