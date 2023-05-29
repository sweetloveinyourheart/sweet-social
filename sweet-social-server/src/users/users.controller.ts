import { Controller, Body, Get, Request, UseGuards, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { MessageDto } from 'src/auth/dto/message.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from './dto/update-avatar';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (access token required)' })
  @ApiResponse({ type: UserProfileDto, status: 200 })
  @Get('/profile')
  async getUserProfile(@Request() req: Request): Promise<UserProfileDto> {
    const id = req['user'].id
    return await this.usersService.getUserProfile(id)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile (access token required)' })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Put('/update/profile')
  async updateProfile(@Request() req: Request, @Body() data: UpdateProfileDto): Promise<MessageDto> {
    const id = req['user'].id
    return await this.usersService.updateProfile(id, data)
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
}
