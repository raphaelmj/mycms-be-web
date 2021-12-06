import { ImageElement } from './image-element.interface';
import { MovieElement } from './movie-element.interface';
import { MediaType } from '../types/media-type';

export interface GalleryElement extends ImageElement, MovieElement {
  type: MediaType;
}

export interface LinkElement {
  link: string;
  name: string;
}

export interface ProgressGalleryElement {
  name: string;
  imageThumb: string;
  images: GalleryElement[];
}

export enum CustomTableElementStateName {
  rent = 'rent',
  free = 'free',
}

export interface CustomTableElementState {
  stateName: CustomTableElementStateName;
  firm: string;
}

export interface CustomTableInfoAssets {
  situaPlan?: ImageElement | null;
  buildingLocation: ImageElement | null;
  plan: ImageElement | null;
}

export interface CustomTableElement {
  building?: string;
  localName: string;
  state: CustomTableElementState;
  area: string;
  infoAssets: CustomTableInfoAssets;
}
