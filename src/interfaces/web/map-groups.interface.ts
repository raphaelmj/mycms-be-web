import { MapWebPoint } from './map-web-point.interface';

export interface MapGroups {
  plan?: MapWebPoint[];
  open?: MapWebPoint[];
  sell?: MapWebPoint[];
  end?: MapWebPoint[];
}
