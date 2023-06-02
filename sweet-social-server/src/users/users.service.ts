import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UserDetailDto } from './dto/user-dto';
import { MessageDto } from 'src/common/dto/message.dto';
import * as bcrypt from 'bcrypt';
import { GcpBucketService } from 'src/gcp-bucket/gcp-bucket.service';
import { BasicUserDto } from './dto/basic-info.dto';
import { Following } from './entities/following.entity';
import { Follower } from './entities/follower.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(Following) private readonly followingRepository: Repository<Following>,
    @InjectRepository(Follower) private readonly followersRepository: Repository<Follower>,
    private readonly gcpBucketService: GcpBucketService,
    private readonly postsService: PostsService
  ) { }

  private async hashPassword(pass: string): Promise<string> {
    // Hashing password
    const saltOrRounds = 10;
    return await bcrypt.hash(pass, saltOrRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.usersRepository.findOneBy({ email: createUserDto.email })
    if (existedUser) {
      throw new BadRequestException('Email already exists.')
    }

    const existedProfile = await this.profilesRepository.findOneBy({ username: createUserDto.profile.username })
    if (existedProfile) {
      throw new BadRequestException('Username already exists.')
    }

    // Hashing password
    const hash = await this.hashPassword(createUserDto.password)

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hash
    })
    await this.usersRepository.save(newUser)

    return newUser;
  }

  async getUserProfile(id: number, username: string): Promise<UserDetailDto> {
    const user = await this.usersRepository.findOne({
      relations: ['profile'],
      where: { profile: { username } }
    });

    const followers = await this.followersRepository.countBy({ user: { profile: { username } } })
    const following = await this.followingRepository.countBy({ user: { profile: { username } } })
    const post = await this.postsService.countPostByUsername(username)
    const followed = await this.followersRepository.exist({ where: { followerUser: { id }, user: { id: user.id } } })

    const userDetail: UserDetailDto = {
      email: user.email,
      isVerified: user.isVerified,
      profile: {
        username: user.profile.username,
        name: user.profile.name,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        gender: user.profile.gender
      },
      userStats: {
        followers,
        following,
        post
      },
      followed
    }

    return userDetail
  }

  async getProfile(id: number): Promise<UserDetailDto> {
    const user = await this.usersRepository.findOne({
      relations: ['profile'],
      where: { id }
    });

    const followers = await this.followersRepository.countBy({ user: { id } })
    const following = await this.followingRepository.countBy({ user: { id } })
    const post = await this.postsService.countPostByUsername(user.profile.username)

    const userDetail: UserDetailDto = {
      email: user.email,
      isVerified: user.isVerified,
      profile: {
        username: user.profile.username,
        name: user.profile.name,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        gender: user.profile.gender
      },
      userStats: {
        followers,
        following,
        post
      }
    }

    return userDetail
  }

  async getBasicUserInfo(id: number, username: string): Promise<BasicUserDto> {
    const user = await this.usersRepository.findOne({
      relations: ['profile'],
      where: {
        profile: {
          username
        }
      }
    })

    const followers = await this.followersRepository.countBy({ user: { profile: { username } } })
    const following = await this.followingRepository.countBy({ user: { profile: { username } } })
    const post = await this.postsService.countPostByUsername(username)
    const followed = await this.followersRepository.exist({ where: { followerUser: { id }, user: { id: user.id } } })

    const userInfo: BasicUserDto = {
      id: user.id,
      profile: {
        name: user.profile.name,
        avatar: user.profile.avatar,
        username: user.profile.username
      },
      userStats: {
        followers,
        following,
        post
      },
      followed
    }

    return userInfo
  }

  async getSuggestedAccounts(userId: number): Promise<BasicUserDto[]> {
    // find user with blue tick
    const accounts = await this.usersRepository.find({
      relations: ['profile'],
      where: {
        profile: {
          premium: true
        },
        id: Not(userId)
      },
      take: 5
    })

    // get user basic info (include followers, posts count...)
    const suggestedList: BasicUserDto[] = await Promise.all(accounts.map(async (acc) => {
      return await this.getBasicUserInfo(userId, acc.profile.username)
    }))

    return suggestedList
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne({ relations: ['profile'], where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email })
  }

  async updateUser(userId: number, updateData: Partial<User>) {
    await this.usersRepository.update({ id: userId }, updateData);
  }

  async updateProfile(userId: number, updateData: UpdateProfileDto): Promise<MessageDto> {
    const profile = await this.profilesRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] })
    if (!profile) {
      throw new NotFoundException('Profile not found !')
    }

    await this.profilesRepository.update({ id: profile.id }, updateData)
    return { message: "Profile updated! " }
  }

  async upgradeUser(userId: number): Promise<MessageDto> {
    const profile = await this.profilesRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] })
    if (!profile) {
      throw new NotFoundException('Profile not found !')
    }

    await this.profilesRepository.update({ id: profile.id }, { premium: true })
    return { message: "Profile updated! " }
  }

  async checkUserIsVerified(id: number): Promise<boolean> {
    const { isVerified } = await this.usersRepository.findOneBy({ id })
    return isVerified
  }

  async updateAvatar(userId: number, file: Express.Multer.File): Promise<MessageDto> {
    const profile = await this.profilesRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] })
    if (!profile) {
      throw new NotFoundException('Profile not found !')
    }

    const newAvatar = await this.gcpBucketService.uploadFile(file)
    await this.profilesRepository.update({ id: profile.id }, { avatar: newAvatar.metadata.mediaLink })

    return { message: "Avatar updated! " }
  }

  async followUser(userId: number, followingId: number): Promise<MessageDto> {
    const followingUser = await this.usersRepository.findOneBy({ id: followingId })
    if (!followingUser) {
      throw new NotFoundException('Not found !')
    }

    const isFollowed = await this.followingRepository.findOneBy({ user: { id: userId }, followingUser: { id: followingId } })
    if (isFollowed) {
      throw new BadRequestException('You already follow this user!')
    }

    const newFollowing = this.followingRepository.create({ user: { id: userId }, followingUser })
    const newFollower = this.followersRepository.create({ user: { id: followingId }, followerUser: { id: userId } })

    await this.followersRepository.save(newFollower)
    await this.followingRepository.save(newFollowing)

    return { message: "Follow user successfully !" }
  }

  async unfollowUser(userId: number, followingId: number): Promise<MessageDto> {
    const followingUser = await this.followingRepository.findOneBy({ user: { id: userId }, followingUser: { id: followingId } })
    const followerUser = await this.followersRepository.findOneBy({ user: { id: followingId }, followerUser: { id: userId } })

    if (!followingUser || !followerUser) {
      throw new NotFoundException('Not found !')
    }

    await this.followingRepository.remove(followingUser)
    await this.followersRepository.remove(followerUser)

    return { message: "UnFollow user successfully !" }
  }
}
