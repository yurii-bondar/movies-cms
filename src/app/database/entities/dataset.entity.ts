import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  AllowNull,
  CreatedAt,
  HasMany,
} from 'sequelize-typescript';
import { User, Movie } from '.';

@Table({ tableName: 'datasets', timestamps: false })
export class Dataset extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
    userId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
    bytesSize!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
    fileName!: string;

  @CreatedAt
  @Column(DataType.DATE)
    addDate!: Date;

  @HasMany(() => Movie, { foreignKey: 'datasetId' })
    movies!: Movie[];
}
