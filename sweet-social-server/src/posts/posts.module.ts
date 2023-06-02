import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Media } from './entities/media.entity';
import { GcpBucketModule } from 'src/gcp-bucket/gcp-bucket.module';
import { PostSettings } from './entities/post-settings.entity';
import { ReactionsModule } from 'src/reactions/reactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Media, PostSettings]),
    GcpBucketModule,
    ReactionsModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
