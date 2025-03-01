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
import { User } from './user.entity';

@Table({ tableName: 'sessions', timestamps: false })
export class Session extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
    userId!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
    refreshToken!: string | null;

  @Column(DataType.BOOLEAN)
    isActive!: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
    signinDate!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
    logoutDate!: Date;

  @BelongsTo(() => User)
    user!: User;
}
