import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto, RefreshTokenDto, SignOutDto } from './dto/auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { MessageDto } from './dto/message.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({ summary: 'Signin with email' })
  @ApiResponse({ type: AuthDto })
  signIn(@Body() signInDto: SignInDto): Promise<AuthDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @ApiOperation({ summary: 'Register new account' })
  @ApiResponse({ type: AuthDto })
  signUp(@Body() signUpDto: SignUpDto): Promise<AuthDto> {
    return this.authService.signUp(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ type: RefreshTokenDto })
  refreshToken(@Query('token') token: string): Promise<RefreshTokenDto> {
    return this.authService.refreshToken(token)
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify-account')
  @ApiOperation({ summary: 'Verify account by token' })
  @ApiResponse({ type: MessageDto })
  verifyAccount(@Query('token') token: string): Promise<MessageDto> {
    return this.authService.verifyAccount(token)
  }

  @HttpCode(HttpStatus.OK)
  @Delete('sign-out')
  @ApiOperation({ summary: 'Sign out from application' })
  @ApiResponse({ type: SignOutDto })
  signOut(@Query('refresh-token') token: string): Promise<SignOutDto> {
    return this.authService.signOut(token)
  }
}
