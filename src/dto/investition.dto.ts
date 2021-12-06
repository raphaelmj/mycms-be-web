import { ApiProperty } from '@nestjs/swagger';
import {
  CustomTableElement,
  GalleryElement,
  LinkElement,
  ProgressGalleryElement,
} from '../interfaces/investition.interface';
import { GalleryType } from '../enums/gallery-type.enum';
import { MapFiles } from '../interfaces/map-files.interface';
import { ContactElement } from '../interfaces/contact-element.interface';
export class InvestitionDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  alias?: string;
  @ApiProperty()
  listImage: string;
  @ApiProperty()
  fullImage: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  labelColor: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  rentAreaSpace: string;
  @ApiProperty()
  areaSize: string;
  @ApiProperty()
  parking: string;
  @ApiProperty()
  rentiers: string;
  @ApiProperty()
  textLeft: string;
  @ApiProperty()
  textRight: string;
  @ApiProperty()
  openDate: string;
  @ApiProperty()
  remodeling: string;
  @ApiProperty()
  buyDate: Date;
  @ApiProperty()
  gallery: GalleryElement[];
  @ApiProperty()
  progressGallery: ProgressGalleryElement[];
  @ApiProperty()
  district: string;
  @ApiProperty()
  buildingsCount: string;
  @ApiProperty()
  floorCount: string;
  @ApiProperty()
  flatCount: string;
  @ApiProperty()
  flatsAreas: string;
  @ApiProperty()
  garageCount: string;
  @ApiProperty()
  serviceLocalsCount: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  workState: string;
  @ApiProperty()
  contactLink: string;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  customTable: CustomTableElement[];
  @ApiProperty()
  showCustomTable: boolean;
  @ApiProperty()
  link: LinkElement;
  @ApiProperty()
  mapFiles: MapFiles;
  @ApiProperty()
  mapLat: number;
  @ApiProperty()
  mapLng: number;
  @ApiProperty()
  webMap: string;
  @ApiProperty()
  showDistrictLabel: boolean;
  @ApiProperty()
  showWebsite: boolean;
  @ApiProperty()
  galleryType: GalleryType;
  @ApiProperty()
  contacts: ContactElement[];
  @ApiProperty()
  ordering: number;
  @ApiProperty()
  metaTitle: string;
  @ApiProperty()
  metaKeywords: string;
  @ApiProperty()
  metaDescription: string;
}
