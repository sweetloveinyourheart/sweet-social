import { Controller, Body, Get, Request, UseGuards, Put, UseInterceptors, UploadedFile, BadRequestException, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { MessageDto } from 'src/common/dto/message.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from './dto/update-avatar';
import { BasicUserDto } from './dto/basic-info.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get famous users base on blue tick - premium account' })
  @ApiResponse({ type: [BasicUserDto], status: 200 })
  @Get('/famous-users')
  async getSuggestedAccount(@Request() req: Request): Promise<BasicUserDto[]> {
    const id = req['user'].id
    return await this.usersService.getSuggestedAccounts(id)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ type: UserProfileDto, status: 200 })
  @Get('/profile')
  async getUserProfile(@Request() req: Request): Promise<UserProfileDto> {
    const id = req['user'].id
    return await this.usersService.getUserProfile(id)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Post('/follow/:userId')
  async follow(
    @Request() req: Request,
    @Param('userId') userId: number
  ): Promise<MessageDto> {
    const id = req['user'].id
    return await this.usersService.followUser(id, userId)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Put('/update/profile')
  async updateProfile(@Request() req: Request, @Body() data: UpdateProfileDto): Promise<MessageDto> {
    const id = req['user'].id
    return await this.usersService.updateProfile(id, data)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade an account to premium with blue tick (ADMIN ROLE ONLY)' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Put('/upgrade/:userId')
  async upgradeUser(@Param('userId') userId: number): Promise<MessageDto> {
    return await this.usersService.upgradeUser(userId)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAvatarDto })
  @ApiOperation({ summary: 'Update avatar using GCP Bucket Service' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter(req, file, callback) {
        // Check the file type
        if (file.mimetype.startsWith('image/')) {
          callback(null, true); // Accept the file with image format
        } else {
          callback(new BadRequestException('Invalid file type'), false); // Reject the file
        }
      },
    })
  )
  @Put('/update/avatar')
  async updateAvatar(@Request() req: Request, @UploadedFile() avatar: Express.Multer.File) {
    const id = req['user'].id
    return await this.usersService.updateAvatar(id, avatar)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Delete('/unfollow/:userId')
  async unFollow(
    @Request() req: Request,
    @Param('userId') userId: number
  ): Promise<MessageDto> {
    const id = req['user'].id
    return await this.usersService.unfollowUser(id, userId)
  }
}
