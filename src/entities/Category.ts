import { Article } from './Article';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  Column,
} from 'typeorm';
import { Page } from './Page';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  alias: string;

  @OneToMany((type) => Article, (article) => article.category, {})
  articles?: Article[];

  @OneToMany((type) => Page, (page) => page.office, {})
  pages?: Page[];
}
