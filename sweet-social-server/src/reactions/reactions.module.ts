import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ReactionsController } from './reactions.controller';
import { Saved } from './entities/saved.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Comment, Saved]),
    NotificationsModule
  ],
  providers: [ReactionsService],
  exports: [ReactionsService],
  controllers: [ReactionsController]
})
export class ReactionsModule {}
