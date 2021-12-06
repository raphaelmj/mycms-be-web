import { Test, TestingModule } from '@nestjs/testing';
import { InvestitionController } from './investition.controller';

describe('InvestitionController', () => {
  let controller: InvestitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestitionController],
    }).compile();

    controller = module.get<InvestitionController>(InvestitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
