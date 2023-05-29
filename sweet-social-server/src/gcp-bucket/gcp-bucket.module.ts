import { Module } from '@nestjs/common';
import { GcpBucketService } from './gcp-bucket.service';

@Module({
  providers: [GcpBucketService],
  exports: [GcpBucketService]
})
export class GcpBucketModule {}
