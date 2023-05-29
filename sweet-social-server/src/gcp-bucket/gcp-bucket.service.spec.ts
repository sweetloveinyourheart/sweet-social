import { Test, TestingModule } from '@nestjs/testing';
import { GcpBucketService } from './gcp-bucket.service';

describe('GcpBucketService', () => {
  let service: GcpBucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcpBucketService],
    }).compile();

    service = module.get<GcpBucketService>(GcpBucketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
