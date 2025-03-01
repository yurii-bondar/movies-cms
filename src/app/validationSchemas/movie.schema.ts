import { JSONSchemaType } from 'ajv';

import { MOVIE_FORMATS, FIRST_MOVIE_YEAR } from '../constants';

export type MovieFormat = MOVIE_FORMATS.VHS | MOVIE_FORMATS.DVD | MOVIE_FORMATS.BLU_RAY;
const movieFormats: MovieFormat[] = Object.values(MOVIE_FORMATS);

interface MovieBase {
  name: string;
  year: number;
  format: MovieFormat;
  actors: string[];
}

const createMovie: JSONSchemaType<MovieBase[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      year: { type: 'integer', minimum: FIRST_MOVIE_YEAR, maximum: new Date().getFullYear() },
      format: { type: 'string', enum: movieFormats },
      actors: { type: 'array', items: { type: 'string', minLength: 1 }, minItems: 1 },
    },
    required: ['name', 'year', 'format', 'actors'],
    additionalProperties: false,
  },
  minItems: 1,
  uniqueItems: true,
};

const updateMovie = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    year: { type: 'integer', minimum: FIRST_MOVIE_YEAR, maximum: new Date().getFullYear() },
    format: { type: 'string', enum: movieFormats },
    actors: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
    },
  },
  required: [],
  additionalProperties: false,
};

const listMovies: JSONSchemaType<{
  name?: string;
  year?: number;
  format?: MovieFormat;
  actor?: string;
  datasetId?: number;
  sortBy?: 'name' | 'year';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, nullable: true },
    year: {
      type: 'integer', minimum: FIRST_MOVIE_YEAR, maximum: new Date().getFullYear(), nullable: true,
    },
    format: { type: 'string', enum: movieFormats, nullable: true },
    actor: { type: 'string', minLength: 1, nullable: true },
    datasetId: { type: 'integer', minimum: 1, nullable: true },
    sortBy: { type: 'string', enum: ['name', 'year'], nullable: true },
    order: { type: 'string', enum: ['ASC', 'DESC'], nullable: true },
    page: { type: 'integer', minimum: 1, nullable: true },
    limit: {
      type: 'integer', minimum: 1, maximum: 50, nullable: true,
    },
  },
  additionalProperties: false,
};

const idParam: JSONSchemaType<{ id: number }> = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
  },
  required: ['id'],
  additionalProperties: false,
};

export default {
  createMovie,
  updateMovie,
  idParam,
  listMovies,
};
