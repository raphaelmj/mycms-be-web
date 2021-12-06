import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../../../entities/Variant';

@Injectable()
export class VariantWebService {
  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  async getPageVariants(pageId: number): Promise<Variant[]> {
    return await this.variantRepository.find({
      where: {
        page: {
          id: pageId,
        },
      },
      order: { ordering: 'ASC' },
    });
  }

  async getVariantByPath(path: string) {
    return await this.variantRepository.findOne({ path });
  }
}
