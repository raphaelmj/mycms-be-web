import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../../entities/Page';
import { Popup } from '../../entities/Popup';
import { Variant } from '../../entities/Variant';
import { Department } from '../../entities/Department';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { PopupDataUpdateDto } from '../../dto/popup-data-update.dto';
import { CroppedImageService } from '../cropped-image/cropped-image.service';
import { ImageOrientationType } from '../../types/image-orientation.type';

@Injectable()
export class PopupService {
  constructor(
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private readonly croppedImageService: CroppedImageService,
  ) {}

  async all(relations: string[] = []): Promise<Popup[]> {
    return await this.popupRepository.find({ relations });
  }

  async updateField(body: FieldUpdateDto): Promise<Popup> {
    const update = {};
    update[body.field] = body.value;
    await this.popupRepository.update(body.id, update);
    return await this.popupRepository.findOne(body.id);
  }

  async create(body: PopupDataUpdateDto) {
    const popup: Popup = (<unknown>body.popup) as Popup;
    if (body.croppedImage) {
      const imageData: {
        path: string;
        sizeString: string;
        orientation: ImageOrientationType;
      } = await this.croppedImageService.makeCroppedImagePopup(
        body.croppedImage,
        'popups',
        'jpg',
      );
      if (imageData) {
        popup.popupData.image = imageData;
      }
      return await this.popupRepository.create(popup).save();
    }
    return null;
  }

  async update(body: PopupDataUpdateDto) {
    const popup: Popup = await this.popupRepository.findOne(body.popup.id);
    popup.popupData = body.popup.popupData;
    popup.showEveryWhere = body.popup.showEveryWhere;
    popup.status = body.popup.showEveryWhere;
    if (body.croppedImage) {
      const imageData: {
        path: string;
        sizeString: string;
        orientation: ImageOrientationType;
      } = await this.croppedImageService.makeCroppedImagePopup(
        body.croppedImage,
        'popups',
        'jpg',
      );
      if (imageData) {
        popup.popupData.image = imageData;
      }
      await popup.save();
      return await this.popupRepository.findOne(body.popup.id);
    }
    await popup.save();
    return await this.popupRepository.findOne(body.popup.id);
  }

  async delete(id: number) {
    return await this.popupRepository.delete(id);
  }
}
