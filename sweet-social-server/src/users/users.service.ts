import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UserProfileDto } from './dto/user-dto';
import { MessageDto } from 'src/common/dto/message.dto';
import * as bcrypt from 'bcrypt';
import { GcpBucketService } from 'src/gcp-bucket/gcp-bucket.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>,
    private readonly gcpBucketService: GcpBucketService
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

  async getUserProfile(id: number): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({ relations: ['profile'], where: { id } });
    const userProfile: UserProfileDto = {
      email: user.email,
      isVerified: user.isVerified,
      profile: {
        username: user.profile.username,
        name: user.profile.name,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        gender: user.profile.gender
      }
    }

    return userProfile
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
}
