import { MapInvestStatusType } from '../../types/map-invest-status.type';
import { MapCloudPositionType } from '../../types/map-cloud-position.type';
import { MapCloudSizeType } from '../../types/map-cloud-size.type';
import { MapWebType } from '../../types/map-web.type';

export interface MapWebPoint {
  key: number | string;
  name: string;
  address: string;
  status: MapInvestStatusType;
  left: string;
  top: string;
  size: MapCloudSizeType;
  type: MapWebType;
  cloudPosition: MapCloudPositionType | null;
  cloudLeft: string;
  cloudTopBottom: string;
  openTo: MapCloudPositionType;
  url: string;
  childs: MapWebPoint[];
}
