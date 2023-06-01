import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Comment])
  ],
  providers: [ReactionsService]
})
export class ReactionsModule {}
