import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../../entities/Position';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { StaticMenus } from '../../interfaces/web/static-menus.interface';
import { map } from 'p-iteration';
import { Page } from '../../entities/Page';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async all(): Promise<Position[]> {
    return await this.positionRepository.find();
  }

  async updateField(body: FieldUpdateDto): Promise<Position> {
    const update = {};
    update[body.field] = body.value;
    await this.positionRepository.update(body.id, update);
    return await this.positionRepository.findOne(body.id);
  }

  async getPostionsData(): Promise<StaticMenus> {
    const staticMenus: StaticMenus = {
      top: [],
      bottom: [],
    };
    const positions: Position[] = await this.positionRepository.find();
    await map(positions, async (pos, i) => {
      const pages: Page[] = [];
      await map(<number[]>(<unknown>pos.pages), async (pg, j) => {
        pages[j] = await this.pageRepository.findOne(pg);
      });
      staticMenus[pos.name] = pages;
    });
    return staticMenus;
  }
}
