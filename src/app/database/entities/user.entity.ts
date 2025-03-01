import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Session } from './session.entity';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
    email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
    name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
    password!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
    regDate!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
    lastSignInDate!: Date;

  @HasMany(() => Session)
    sessions!: Session[];
}
