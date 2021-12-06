import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import * as moment from 'moment';
import { PageViewType } from '../enums/page-view-type.enum';
import { UserRole } from '../enums/user-role.enum';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    length: 500,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: [UserRole.admin, UserRole.redactor],
    default: UserRole.redactor,
  })
  role: UserRole;

  @Column({ type: 'boolean' })
  status: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: true,
    transformer: {
      from: (value?: Date | null) =>
        value === undefined || value === null
          ? value
          : moment(value).toISOString(),
      to: (value?: string | null) =>
        value === undefined || value === null ? value : new Date(value),
    },
  })
  public updatedAt?: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    update: false,
    transformer: {
      from: (value?: Date | null) =>
        value === undefined || value === null
          ? value
          : moment(value).toISOString(),
      to: (value?: string | null) =>
        value === undefined || value === null ? value : new Date(value),
    },
  })
  public createdAt?: Date;
}
