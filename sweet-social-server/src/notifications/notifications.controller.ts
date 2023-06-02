import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: [NotificationDto] })
  @ApiOperation({ summary: 'Get user notifications' })
  @Get()
  getNotifications(@Request() req) {
    const userId = req['user'].id
    return this.notificationsService.getNotifications(userId);
  }
}
