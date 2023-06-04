import {
  Controller, Body, Get, Request, UseGuards, Put,
  UseInterceptors, UploadedFile, BadRequestException, Param, Delete, Post, Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDetailDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { MessageDto } from 'src/common/dto/message.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from './dto/update-avatar';
import { BasicUserDto, ShortUserInfo } from './dto/basic-info.dto';
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
  @ApiOperation({ summary: 'Get basic user info by username' })
  @ApiResponse({ type: BasicUserDto, status: 200 })
  @Get('/quick-view/:username')
  async quickViewAccount(
    @Request() req: Request,
    @Param('username') username: string
  ): Promise<BasicUserDto> {
    const id = req['user'].id
    return await this.usersService.getBasicUserInfo(id, username)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiResponse({ type: UserDetailDto, status: 200 })
  @Get('/profile/:username')
  async getUserProfile(
    @Request() req: Request,
    @Param('username') username: string
  ): Promise<UserDetailDto> {
    const id = req['user'].id
    return await this.usersService.getUserProfile(id, username)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personal profile' })
  @ApiResponse({ type: UserDetailDto, status: 200 })
  @Get('/profile')
  async getProfile(@Request() req: Request): Promise<UserDetailDto> {
    const id = req['user'].id
    return await this.usersService.getProfile(id)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search user' })
  @ApiResponse({ type: [ShortUserInfo], status: 200 })
  @Get('/search')
  async searchUser(@Query('pattern') pattern: string): Promise<ShortUserInfo[]> {
    return await this.usersService.searchUser(pattern)
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
