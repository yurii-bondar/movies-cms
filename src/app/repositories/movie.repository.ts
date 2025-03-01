import { Op } from 'sequelize';
import { Movie, Dataset } from '../database/entities';

async function createMovies(movies: Partial<Movie>[]) {
  return Movie.bulkCreate(movies);
}
async function removeMovie(id: number) {
  return Movie.destroy({ where: { id } });
}

async function updateMovie(id: number, data: Partial<Movie>) {
  return Movie.update(data, { where: { id } });
}

async function getMovieById(id: number) {
  return Movie.findByPk(id, {
    include: [{
      model: Dataset,
      attributes: ['fileName'],
    }],
  });
}

async function listMovies(
  filters: {
    name?: string;
    year?: number;
    format?: string;
    actor?: string;
    datasetId?: number;
  },
  sortBy: 'name' | 'year' = 'name',
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  limit: number = 10,
) {
  const where: { [key: string]: unknown } = {};

  if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };
  if (filters.year) where.year = filters.year;
  if (filters.format) where.format = filters.format;
  if (filters.actor) where.actors = { [Op.like]: `%${filters.actor}%` };
  if (filters.datasetId) where.datasetId = filters.datasetId;

  return Movie.findAndCountAll({
    where,
    include: [{ model: Dataset, attributes: ['fileName'] }],
    order: [[sortBy, order]],
    limit,
    offset: (page - 1) * limit,
  });
}

export default {
  createMovies,
  removeMovie,
  updateMovie,
  getMovieById,
  listMovies,
};
