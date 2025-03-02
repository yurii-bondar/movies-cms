import { Request, Response, NextFunction } from 'express';
import movieService from '../services/movie.service';
import errorLogUtil from '../helpers/errorLog';
import { HTTP_STATUS_CODES } from '../constants';
import CacheService from '../services/cache.service';

const errorLog = errorLogUtil(__filename);

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

async function importMovies(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: 'No files uploaded' });
    }

    const userId = req.user?.id;

    if (userId) {
      const datasets = await movieService.importMultipleMovies(
        userId, req.files as Express.Multer.File[],
      );

      if (datasets?.datasets?.length) {
        await CacheService.destroy();
        res
          .status(HTTP_STATUS_CODES.CREATED)
          .json({
            message: 'Movies imported successfully',
            datasets,
          });
      }
    }
  } catch (err) {
    errorLog('importMovies', err);
    next(err);
  }
}

async function create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const movies = Array.isArray(req.body) ? req.body : [req.body];
    const createdMovies = await movieService.createMovies(movies);

    if (createdMovies?.length) {
      await CacheService.destroy();
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ message: 'Movies created successfully', createdMovies });
    }
  } catch (err) {
    next(err);
  }
}

async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const deletedCount = await movieService.removeMovie(id);

    if (deletedCount) {
      await CacheService.destroy();
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: 'Movie deleted' });
    } else {
      res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ message: 'Movie not found' });
    }
  } catch (err) {
    next(err);
  }
}

async function update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const movie = await movieService.getMovieById(id, req);

    if (!movie) {
      res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ message: 'Movie not found' });
    } else {
      await movieService.updateMovie(id, req.body);
      await CacheService.destroy();

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: 'Movie updated' });
    }
  } catch (err) {
    next(err);
  }
}

async function show(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const movie = await movieService.getMovieById(id, req);

    if (!movie) {
      res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
}

async function list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      name,
      year,
      format,
      actor,
      datasetId,
      sortBy = 'name',
      order = 'ASC',
      page = '1',
      limit = '10',
    } = req.query;

    const movies = await movieService.listMovies(
      req,
      name as string,
      year ? Number(year) : undefined,
      format as string,
      actor as string,
      datasetId ? Number(datasetId) : undefined,
      sortBy as 'name' | 'year',
      order as 'ASC' | 'DESC',
      Number(page),
      Number(limit),
    );

    res.json(movies);
  } catch (err) {
    next(err);
  }
}

export default {
  importMovies,
  create,
  remove,
  update,
  show,
  list,
};
