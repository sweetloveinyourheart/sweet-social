import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Media } from './entities/media.entity';
import { GcpBucketModule } from 'src/gcp-bucket/gcp-bucket.module';
import { PostSettings } from './entities/post-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Media, PostSettings]),
    GcpBucketModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
