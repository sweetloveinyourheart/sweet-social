import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Not, Repository } from 'typeorm';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>
  ) { }

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
    const notifications = await this.notificationsRepository.find({
      relations: ['sender', 'sender.profile','post'],
      where: {
        recipient: { id: userId },
        sender: {
          id: Not(userId)
        }
      },
      select: {
        content: true,
        createdAt: true,
        isRead: true,
        post: {
          id: true
        },
        sender: {
          id: true,
          profile: {
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    })
    return notifications
  }
}
