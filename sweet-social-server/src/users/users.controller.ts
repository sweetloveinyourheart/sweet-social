import { Controller, Body, Patch, Param, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (access token required)' })
  @ApiResponse({ type: UserProfileDto })
  @Get('/profile')
  async getUserProfile(@Request() req: Request): Promise<UserProfileDto> {
    const id = req['user'].id
    return await this.usersService.getUserProfile(id)
  }
}
