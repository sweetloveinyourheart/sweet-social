import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';

@Module({
  controllers: [InteractionsController],
  providers: [InteractionsService]
})
export class InteractionsModule {}
