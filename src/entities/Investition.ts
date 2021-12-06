import { Variant } from './Variant';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as moment from 'moment';
import { Office } from './Office';
import { GalleryType } from '../enums/gallery-type.enum';
import { Popup } from './Popup';

@Entity()
export class Investition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  alias: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  listImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullImage: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  labelColor: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rentAreaSpace: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  areaSize: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  parking: string;

  @Column({ type: 'text', nullable: true })
  rentiers: string;

  @Column({ type: 'text', nullable: true })
  textLeft: string;

  @Column({ type: 'text', nullable: true })
  textRight: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  openDate: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  remodeling: string;

  @Column({ type: 'varchar', nullable: true })
  buyDate: string;

  @Column({ type: 'text', nullable: true })
  gallery: string;

  @Column({ type: 'text', nullable: true })
  progressGallery: string;

  @Column({ type: 'boolean', default: false })
  showCustomTable: boolean;

  @Column({
    type: 'enum',
    enum: [GalleryType.none, GalleryType.standard, GalleryType.progress],
    default: [GalleryType.none],
  })
  galleryType: GalleryType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  buildingsCount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  floorCount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  flatCount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  flatsAreas: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  garageCount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serviceLocalsCount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  endDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  workState: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactLink: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  customTable: string;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: 'text', nullable: true })
  mapFiles: string;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  mapLat: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  mapLng: number;

  @Column({ type: 'text', nullable: true })
  webMap: string;

  @Column({ type: 'boolean', default: false })
  showDistrictLabel: boolean;

  @Column({ type: 'boolean', default: false })
  showWebsite: boolean;

  @Column({ type: 'text', nullable: true })
  contacts: string;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle: string;

  @Column({ type: 'text' })
  metaKeywords: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @ManyToMany((type) => Office, (office) => office.investitions)
  @JoinTable({ name: 'investition_office' })
  offices: Office[];

  @ManyToMany((type) => Variant, (variant) => variant.investitions)
  variants: Variant[];

  @ManyToMany((type) => Popup, (popup) => popup.investitions)
  @JoinTable({ name: 'popup_investition' })
  popups: Popup[];

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
