import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { MapCity } from '../../../interfaces/web/map-city.interface';
import { MapWebPoint } from '../../../interfaces/web/map-web-point.interface';
import { MapGroups } from '../../../interfaces/web/map-groups.interface';

export interface AllMapsData {
  cities: MapCity[];
  polandMap: MapWebPoint[];
  warsawMap: MapWebPoint[];
  polandGroup: MapGroups;
  warsawGroup: MapGroups;
}

@Injectable()
export class MapsService {
  async getMapsData(): Promise<AllMapsData> {
    const cities: MapCity[] = await this.getCities();
    const polandMap: MapWebPoint[] = await this.getPolandMapPoints();
    const warsawMap: MapWebPoint[] = await this.getWarsawMapPoints();
    const polandGroup: MapGroups = await this.getPolandMapGroup();
    const warsawGroup: MapGroups = await this.getWarsawMapGroup();
    return { cities, polandMap, warsawMap, polandGroup, warsawGroup };
  }

  async getCities(): Promise<MapCity[]> {
    const cities: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/cities.json',
    );
    return JSON.parse(cities.toString());
  }

  async getPolandMapPoints(): Promise<MapWebPoint[]> {
    const polandMap: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/map_poland.json',
    );
    return JSON.parse(polandMap.toString());
  }

  async getWarsawMapPoints(): Promise<MapWebPoint[]> {
    const warsawMap: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/map_warsaw.json',
    );
    return JSON.parse(warsawMap.toString());
  }

  async getPolandMapGroup(): Promise<MapGroups> {
    const polandGroup: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/poland_group.json',
    );
    return JSON.parse(polandGroup.toString());
  }

  async getWarsawMapGroup(): Promise<MapGroups> {
    const warsawGroup: Buffer = fs.readFileSync(
      process.cwd() + '/static/json/warsaw_group.json',
    );
    return JSON.parse(warsawGroup.toString());
  }
}
