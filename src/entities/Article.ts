import { Category } from './Category';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import * as moment from 'moment';
import { Page } from './Page';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  alias: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: '/img/news_noimg.png',
  })
  image: string;

  @Column({ type: 'text' })
  short: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'text' })
  leftContent: string;

  @Column({ type: 'text' })
  rightContent: string;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle: string;

  @Column({ type: 'text' })
  metaKeywords: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @ManyToOne((type) => Category, (category) => category.articles, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  category?: Category;

  @OneToMany((type) => Page, (page) => page.office, {})
  pages?: Page[];

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
