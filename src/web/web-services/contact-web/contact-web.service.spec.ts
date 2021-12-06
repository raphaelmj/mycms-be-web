import { Test, TestingModule } from '@nestjs/testing';
import { ContactWebService } from './contact-web.service';

describe('ContactWebService', () => {
  let service: ContactWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactWebService],
    }).compile();

    service = module.get<ContactWebService>(ContactWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
