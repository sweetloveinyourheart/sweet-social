import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { GcpBucketModule } from 'src/gcp-bucket/gcp-bucket.module';
import { Follower } from './entities/follower.entity';
import { Following } from './entities/following.entity';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports:[
    GcpBucketModule,
    TypeOrmModule.forFeature([User, Profile, Follower, Following]),
    PostsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
