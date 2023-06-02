import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>
  ) {}

  async newPostNotification(content: string, senderId: number, post: Post) {
    const newNoti = this.notificationsRepository.create({
      content,
      sender: {
        id: senderId
      },
      post,
      recipient: {
        id: post.user.id
      }
    })

    await this.notificationsRepository.save(newNoti)

    return true;
  }

  async getNotifications(userId: number): Promise<NotificationDto[]> {
    return await this.notificationsRepository.findBy({ recipient: { id: userId } })
  }
}
