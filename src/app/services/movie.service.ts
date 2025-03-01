import fs from 'fs';
import { Request } from 'express';
import { promisify } from 'util';
import { createDataset } from '../repositories/dataset.repository';
import movieRepo from '../repositories/movie.repository';
import { Movie } from '../database/entities';
import { DATASETS_DIR } from '../constants';
import { MovieFormat } from '../validationSchemas/movie.schema';

const readFile = promisify(fs.readFile);

interface ParsedMovie {
  name: string;
  year: number;
  format: MovieFormat;
  actors: string[];
}

async function parseMovieFile(filePath: string): Promise<ParsedMovie[]> {
  const content = await readFile(filePath, 'utf-8');
  const movies: ParsedMovie[] = [];

  const blocks = content.split(/\n\s*\n/);
  blocks.forEach((block) => {
    const lines = block.split('\n').map((line) => line.trim());
    const title = lines.find((line) => line.startsWith('Title:'))?.replace('Title: ', '');
    const year = parseInt(lines.find((line) => line.startsWith('Release Year:'))?.replace('Release Year: ', '') || '0', 10);
    const format = lines.find((line) => line.startsWith('Format:'))?.replace('Format: ', '') as MovieFormat;
    const actors = lines.find((line) => line.startsWith('Stars:'))?.replace('Stars: ', '').split(',').map((a) => a.trim()) || [];

    if (title && year && format) {
      movies.push({
        name: title, year, format, actors,
      });
    }
  });

  return movies;
}

async function importMultipleMovies(userId: number, files: Express.Multer.File[]) {
  const results: {
    datasetId: number;
    moviesCount: number
  }[] = [];

  await Promise.all(files.map(async (file) => {
    const datasetName = file.path.replace(`${DATASETS_DIR}/`, '');
    const dataset = await createDataset(userId, datasetName, file.size);
    const movies = await parseMovieFile(file.path);

    const moviesToSave = movies.map((movie) => ({
      ...movie,
      datasetId: dataset.id,
    }));

    await movieRepo.createMovies(moviesToSave);
    results.push({ datasetId: dataset.id, moviesCount: movies.length });
  }));

  return { message: 'Movies imported successfully', datasets: results };
}

async function createMovies(movies: Partial<Movie>[]) {
  return movieRepo.createMovies(movies);
}

async function removeMovie(id: number) {
  return movieRepo.removeMovie(id);
}

async function updateMovie(id: number, data: Partial<Movie>) {
  return movieRepo.updateMovie(id, data);
}

function setMovieSource(movie: Movie, req?: Request): Movie {
  const fileName = movie?.dataset?.fileName || '';

  if (!fileName) return movie;

  let source: string;

  if (req) {
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    source = `${protocol}://${host}/${DATASETS_DIR}/${fileName}`;
  } else {
    source = `/${DATASETS_DIR}/${fileName}`;
  }

  movie.setDataValue('source', source);
  // eslint-disable-next-line no-param-reassign
  delete (movie as Movie).dataValues.dataset;

  return movie;
}

async function getMovieById(id: number, req: Request) {
  const movie = await movieRepo.getMovieById(id);
  if (!movie) return null;

  setMovieSource(movie, req);

  return movie;
}

async function listMovies(
  req?: Request,
  name?: string,
  year?: number,
  format?: string,
  actor?: string,
  datasetId?: number,
  sortBy: 'name' | 'year' = 'name',
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  limit: number = 10,
) {
  const result = await movieRepo.listMovies(
    {
      name, year, format, actor, datasetId,
    },
    sortBy,
    order,
    page,
    limit,
  );

  result.rows.forEach((movie) => setMovieSource(movie, req));

  return result;
}

export default {
  importMultipleMovies,
  removeMovie,
  updateMovie,
  getMovieById,
  listMovies,
  createMovies,
};
