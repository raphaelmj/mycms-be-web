import { Test, TestingModule } from '@nestjs/testing';
import { FormContactController } from './form-contact.controller';

describe('FormContactController', () => {
  let controller: FormContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormContactController],
    }).compile();

    controller = module.get<FormContactController>(FormContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
