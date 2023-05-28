import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UserProfileDto } from './dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>
  ) {

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

    const newUser = this.usersRepository.create(createUserDto)
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

  async checkUserIsVerified(id: number): Promise<boolean> {
    const { isVerified } = await this.usersRepository.findOneBy({ id })
    return isVerified
  }
}
