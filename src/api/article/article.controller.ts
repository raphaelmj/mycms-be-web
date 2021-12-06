import { json } from 'body-parser';
import { CroppedImageService } from './../../services/cropped-image/cropped-image.service';
import { ArticleDto } from './../../dto/article.dto';
import { ArticleService } from './../../services/article/article.service';
import { ArticleQueryDto } from './../../dto/article-query.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Res,
  Post,
  Req,
  Next,
  Delete,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

// @UseGuards(UserAuthGuard)
@Controller('api/article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly croppedImageService: CroppedImageService,
  ) {}

  @Get('all')
  async all(@Res() res) {
    return res.json(await this.articleService.all(['category']));
  }

  @ApiQuery({ name: 'page', type: 'string', required: false })
  @ApiQuery({ name: 'phrase', type: 'string', required: false })
  @Get('many')
  async findMany(@Res() res, @Query() params: ArticleQueryDto) {
    return res.json(await this.articleService.findMany(params));
  }

  @Post('create')
  async imageUploadCreate(
    @Req() req,
    @Body()
    body: {
      article: ArticleDto;
      croppedImage: string;
      categoryId: number | null;
    },
    @Next() next,
  ) {
    req.image = await this.croppedImageService.makeCroppedImage(
      body.croppedImage,
      'arts',
      'jpg',
      false,
    );
    next();
  }

  @Post('create')
  async create(
    @Req() req,
    @Res() res,
    @Body()
    body: {
      article: ArticleDto;
      croppedImage: string;
      categoryId: number | null;
      noImage: boolean;
    },
  ) {
    await this.articleService.create(
      body.article,
      req.image,
      body.categoryId,
      body.noImage,
    );
    return res.json({ body, image: req.image });
  }

  @Post('update')
  async imageUploadUpdate(
    @Req() req,
    @Body()
    body: {
      article: ArticleDto;
      croppedImage: string;
      categoryId: number | null;
    },
    @Next() next,
  ) {
    req.image = await this.croppedImageService.makeCroppedImage(
      body.croppedImage,
      'arts',
      'jpg',
      false,
    );
    next();
  }

  @Post('update')
  async update(
    @Req() req,
    @Res() res,
    @Body()
    body: {
      article: ArticleDto;
      croppedImage: string;
      categoryId: number | null;
      noImage: boolean;
    },
  ) {
    await this.articleService.update(
      body.article,
      req.image,
      body.categoryId,
      body.noImage,
    );
    return res.json({ body, image: req.image });
  }

  @Post('update/field')
  async updateField(
    @Res() res,
    @Body() body: { id: number; value: any; field: string },
  ) {
    return res.json(
      await this.articleService.updateField(body.id, body.value, body.field),
    );
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') id: number, @Res() res) {
    return res.json(await this.articleService.delete(id));
  }
}
