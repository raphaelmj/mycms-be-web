import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
} from 'typeorm';
import * as moment from 'moment';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  alias: string;

  @Column({ type: 'varchar', length: 255 })
  krs: string;

  @Column({ type: 'varchar', length: 255 })
  nip: string;

  @Column({ type: 'varchar', length: 255 })
  regon: string;

  @Column({ type: 'varchar', length: 255 })
  court: string;

  @Column({ type: 'varchar', length: 255 })
  place: string;

  @Column({ type: 'varchar', length: 255 })
  capital: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  linkedInfo: string;

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
  public createdAt?: Date;
}
