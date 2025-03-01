import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { Dataset } from './dataset.entity';
import { MOVIE_FORMATS } from '../../constants';
import { MovieFormat } from '../../validationSchemas/movie.schema';

@Table({
  tableName: 'movies',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['name', 'year', 'format'],
      name: 'unique_movie_constraint',
    },
  ],
})
export class Movie extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
    name!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
    year!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(MOVIE_FORMATS.VHS, MOVIE_FORMATS.DVD, MOVIE_FORMATS.BLU_RAY))
    format!: MovieFormat;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    get() {
      const rawValue = this.getDataValue('actors');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value: string[] | string) {
      this.setDataValue('actors', Array.isArray(value) ? JSON.stringify(value) : value);
    },
  })
    actors!: string[];

  @ForeignKey(() => Dataset)
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
    datasetId?: number;

  @BelongsTo(() => Dataset, { foreignKey: 'datasetId', targetKey: 'id' })
    dataset?: Dataset;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
    addDate!: Date;
}
