import { Controller, Get, Res } from '@nestjs/common';
import { CategoryService } from '../../services/category/category.service';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async findMany(@Res() res) {
    return res.json(await this.categoryService.all([]));
  }
}
