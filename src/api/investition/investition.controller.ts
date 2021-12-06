import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  InvestitionImages,
  InvestitionService,
} from '../../services/investition/investition.service';
import { ApiQuery } from '@nestjs/swagger';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { CroppedImageService } from '../../services/cropped-image/cropped-image.service';
import { InvestitionBodyDto } from '../../dto/investition-body.dto';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';

@Controller('api/investition')
export class InvestitionController {
  constructor(
    private readonly investitionService: InvestitionService,
    private readonly croppedImageService: CroppedImageService,
  ) {}

  @Get('query')
  @ApiQuery({ name: 'variant', type: 'number', required: false })
  async findQuery(@Res() res, @Query() query) {
    return res.json(
      await this.investitionService.findByVariant(query.variant, [
        'variants',
        'offices',
        'popups',
      ]),
    );
  }

  @Get('all')
  async findMany(@Res() res) {
    return res.json(
      await this.investitionService.all(['variants', 'offices', 'popups']),
    );
  }

  @Post('by/ids')
  async getByIds(@Res() res, @Body() body: { ids: number[] }) {
    return res.json(await this.investitionService.getByIds(body.ids));
  }

  @Post('create')
  async create(@Res() res, @Body() body: InvestitionBodyDto) {
    const investitionImages: InvestitionImages = await this.investitionService.createInvestitionImages(
      body,
    );
    return res.json(
      await this.investitionService.create(
        body.investition,
        body.variantIds,
        body.officeIds,
        investitionImages,
      ),
    );
  }

  @Post('update')
  async update(@Res() res, @Body() body: InvestitionBodyDto) {
    const investitionImages: InvestitionImages = await this.investitionService.createInvestitionImages(
      body,
    );
    console.log(body.variantIds);
    return res.json(
      await this.investitionService.update(
        body.investition,
        body.variantIds,
        body.officeIds,
        investitionImages,
      ),
    );
  }

  @Delete('delete/:id')
  async delete(@Res() res, @Param() params) {
    return res.json(await this.investitionService.delete(params.id));
  }

  @Post('update/field')
  async updateField(@Res() res, @Body() body: FieldUpdateDto) {
    return res.json(await this.investitionService.updateField(body));
  }

  @Post('unpin/popup')
  async unpinPopup(@Req() req, @Body() body: UnpinDto) {
    return await this.investitionService.unpinPopup(body);
  }

  @Post('pin/popup')
  async pinPopup(@Req() req, @Body() body: PinDto) {
    return await this.investitionService.pinPopup(body);
  }
}
