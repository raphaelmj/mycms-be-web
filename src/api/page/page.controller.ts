import { Body, Controller, Get, Next, Post, Req, Res } from '@nestjs/common';
import { PageService } from '../../services/page/page.service';
import { PageDataUpdateDto } from '../../dto/page-data-update.dto';
import { PageSlidesLogoDto } from '../../dto/page-slides-logo.dto';
import { PageSlidesListDto } from '../../dto/page-slides-list.dto';
import { CroppedImageService } from '../../services/cropped-image/cropped-image.service';
import { PageSlideDto } from '../../dto/page-slide.dto';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';
import { Page } from '../../entities/Page';
import { PageSlideOneDto } from '../../dto/page-slide-one.dto';

@Controller('api/page')
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly croppedImageService: CroppedImageService,
  ) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(
      await this.pageService.all([
        'contact',
        'category',
        'article',
        'office',
        'departments',
        'department',
        'variants',
        'popups',
      ]),
    );
  }

  @Post('update')
  async update(@Req() req, @Body() body: PageDataUpdateDto) {
    return await this.pageService.updatePage(body);
  }

  @Post('update/slides/logo')
  async updateSlidesLogo(@Req() req, @Body() body: PageSlidesLogoDto) {
    let imageUri: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'page-slides',
        body.imageFormat,
      )
    );
    if (body.noImage) {
      imageUri = null;
    }
    return await this.pageService.updatePagesSlidesLogo(
      imageUri,
      body.id,
      body.noImage,
      body.currentLogo,
    );
  }

  @Post('update/slides/list')
  async updateSlidesList(@Req() req, @Body() body: PageSlidesListDto) {
    return await this.pageService.updatePagesSlidesList(body.slides, body.id);
  }

  @Post('add/slide')
  async addSlide(@Req() req, @Body() body: PageSlideDto) {
    const imageUri: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'page-slides',
        body.imageFormat,
      )
    );
    return await this.pageService.addPageSlide(imageUri, body.id);
  }

  @Post('update/slide/one/logo')
  async updateOneSlide(@Req() req, @Body() body: PageSlideOneDto) {
    const imageUri: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'page-slides-logos',
        body.imageFormat,
      )
    );
    return await this.pageService.updateOnePageSlide(
      imageUri,
      body.id,
      body.index,
    );
  }

  @Post('update/slide/one/image')
  async updateOneSlideImage(@Req() req, @Body() body: PageSlideOneDto) {
    const imageUri: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImage,
        'page-slides',
        body.imageFormat,
      )
    );
    return await this.pageService.updateOnePageSlideImage(
      imageUri,
      body.id,
      body.index,
    );
  }

  @Post('unpin/popup')
  async unpinPopup(@Req() req, @Body() body: UnpinDto) {
    return await this.pageService.unpinPopup(body);
  }

  @Post('pin/popup')
  async pinPopup(@Req() req, @Body() body: PinDto) {
    return await this.pageService.pinPopup(body);
  }
}
