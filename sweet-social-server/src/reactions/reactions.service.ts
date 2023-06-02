import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { MessageDto } from 'src/common/dto/message.dto';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Post } from 'src/posts/entities/post.entity';
import { PostReactionDto } from './dto/post-reaction.dto';
import { Saved } from './entities/saved.entity';
import { CommentDto, PaginationCommentDto } from './dto/comment.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ReactionsService {
    constructor(
        @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
        @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Saved) private readonly savedRepository: Repository<Saved>,
        private readonly notificationsService: NotificationsService
    ) { }

    async likePost(userId: number, post: Post): Promise<MessageDto> {
        const liked = this.likesRepository.create({
            post,
            user: { id: userId }
        })

        await this.likesRepository.save(liked)

        // send notification to post owner
        const notificationContent: string = `like your post`
        await this.notificationsService.newPostNotification(notificationContent, userId, post)

        return { message: 'Post liked!' }
    }

    async commentOnPost(userId: number, post: Post, content: string): Promise<MessageDto> {
        const commented = this.commentsRepository.create({
            content,
            post,
            user: { id: userId }
        })

        await this.commentsRepository.save(commented)

        // send notification to post owner
        const notificationContent: string = `commented on your post`
        await this.notificationsService.newPostNotification(notificationContent, userId, post)

        return { message: 'Post liked!' }
    }

    async dislikePost(userId: number, post: Post): Promise<MessageDto> {
        const liked = await this.likesRepository.findOneBy({ post: { id: post.id }, user: { id: userId } })
        if (!liked) {
            throw new NotFoundException('Post not found !')
        }

        await this.likesRepository.remove(liked)
        return { message: 'Post disliked!' }
    }

    async getPostReactionsByUser(userId: number, postId: number): Promise<PostReactionDto> {
        const saved = await this.savedRepository.exist({ where: { user: { id: userId }, post: { id: postId } } })
        const liked = await this.likesRepository.exist({ where: { user: { id: userId }, post: { id: postId } } })
        return {
            saved,
            liked
        }
    }

    async getPostComments(postId: number, options: IPaginationOptions): Promise<PaginationCommentDto> {
        const querybuilder = this.commentsRepository.createQueryBuilder('cmt')
        querybuilder
            .innerJoin('cmt.user', 'user')
            .innerJoin('user.profile', 'profile')
            .select(['cmt', 'user.email' ,'profile'])
            .where('cmt.post.id = :postId', { postId })
            .getMany()

        return await paginate(querybuilder, options)
    }
}
