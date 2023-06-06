import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Media, MediaType } from './entities/media.entity';
import { NewPostDto, PostSettingDto } from './dto/new-post.dto';
import { GcpBucketService } from 'src/gcp-bucket/gcp-bucket.service';
import { MessageDto } from 'src/common/dto/message.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationPostDto } from './dto/post.dto';
import { PostSettings } from './entities/post-settings.entity';
import { PostDetailDto, PostDetailPagination } from './dto/post-detail.dto';
import { ReactionsService } from 'src/reactions/reactions.service';
import { NewCommentDto } from '../reactions/dto/comment.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
        @InjectRepository(Media) private readonly mediasRepository: Repository<Media>,
        @InjectRepository(PostSettings) private readonly postSettingsRepository: Repository<PostSettings>,
        private readonly gcpBucketService: GcpBucketService,
        private readonly reactionsService: ReactionsService
    ) { }

    private getMediaFileType(minetype: string): MediaType {
        if (minetype.startsWith('image/'))
            return MediaType.Image
        else if (minetype.startsWith('video/'))
            return MediaType.Video
        else
            throw new Error('Invalid file type')
    }

    async createNewPost(userId: number, post: NewPostDto, files: Express.Multer.File[]): Promise<MessageDto> {
        // Upload media to GCP bucket and create media record
        const medias = await Promise.all(files.map(async (media) => {
            try {
                const type = this.getMediaFileType(media.mimetype)
                const mediaUploaded = await this.gcpBucketService.uploadFile(media)

                const newMedia = this.mediasRepository.create({
                    mediaType: type,
                    mediaUrl: mediaUploaded.metadata.mediaLink
                })

                await this.mediasRepository.save(newMedia)

                return newMedia
            } catch (error) {
                return null
            }
        }))

        // Create post settings
        const settings = this.postSettingsRepository.create({
            canComment: post.canComment,
            isPublic: post.isPublic,
            showLikeAndViewCounts: post.showLikeAndViewCounts
        })

        // Create new post
        const newPost = this.postsRepository.create({
            caption: post.caption,
            medias,
            settings,
            user: { id: userId }
        })

        await this.postsRepository.save(newPost)

        return { message: 'Your post has been uploaded' }
    }

    async getPersonalPosts(userId: number, options: IPaginationOptions): Promise<PaginationPostDto> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
        queryBuilder
            .innerJoinAndSelect('post.medias', 'media')
            .where('post.user.id = :userId', { userId })
            .orderBy('post.createdAt', 'DESC')

        return await paginate(queryBuilder, options)
    }

    async getSavedPosts(userId: number, options: IPaginationOptions): Promise<PaginationPostDto> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
        queryBuilder
            .innerJoinAndSelect('post.medias', 'media')
            .leftJoin('post.saved', 'saved')
            .innerJoin('saved.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('post.createdAt', 'DESC')

        return await paginate(queryBuilder, options)
    }

    async getPostById(postId: number): Promise<PostDetailDto> {
        const post = await this.postsRepository.findOne({
            select: {
                id: true,
                caption: true,
                likesCount: true,
                commentsCount: true,
                createdAt: true,
                medias: true,
                user: {
                    id: true,
                    profile: {
                        username: true,
                        name: true,
                        avatar: true
                    }
                },
                settings: {
                    canComment: true,
                    isPublic: true,
                    showLikeAndViewCounts: true
                }
            },
            where: { id: postId },
            relations: ['settings', 'user', 'user.profile', 'medias',]
        })
        if (!post) throw new NotFoundException('Cannot found this post')

        return post
    }

    async getUserPosts(username: string, options: IPaginationOptions): Promise<PaginationPostDto> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
        queryBuilder
            .innerJoinAndSelect('post.medias', 'media')
            .innerJoin('post.user', 'user')
            .innerJoin('user.profile', 'profile')
            .where('profile.username = :username', { username })

        return await paginate(queryBuilder, options)
    }

    async removePost(userId: number, postId: number): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['medias']
        })

        if (!post) {
            throw new NotFoundException('Cannot find this post !')
        }

        await Promise.all(post.medias.map((media) => {
            this.gcpBucketService.removeFile(media.mediaUrl)
        }))

        await this.postsRepository.delete({ id: post.id })

        return { message: 'Post has been deleted !' }
    }

    async getNewsfeedPosts(userId: number, options: IPaginationOptions): Promise<PostDetailPagination> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')

        // we recommend showing posts of author that user following
        queryBuilder
            .innerJoin('post.medias', 'media')
            .innerJoin('post.user', 'user')
            .innerJoin('post.settings', 'settings')
            .innerJoin('user.profile', 'profile')
            .innerJoin('user.followers', 'followers') // join with follower table to find following user's posts
            .innerJoin('followers.followerUser', 'fuser')
            .select(['post', 'media', 'user.id', 'profile.avatar', 'profile.name', 'profile.username'])
            .where('fuser.id = :userId', { userId }) // match where user id exist on the followers list of post owner
            .andWhere('settings.isPublic = true')
            .orderBy('post.createdAt', 'DESC')

        const result = await paginate(queryBuilder, options)
        if (result.meta.itemCount < 1) {
            const queryBuilderForPremium = this.postsRepository.createQueryBuilder('post')

            // looking for awesome post coming from premium user
            queryBuilderForPremium
                .innerJoin('post.medias', 'media')
                .innerJoin('post.settings', 'settings')
                .innerJoin('post.user', 'user')
                .innerJoin('user.profile', 'profile')
                .select(['post', 'media', 'user.id', 'profile.avatar', 'profile.name', 'profile.username'])
                .where('profile.premium = true')
                .andWhere('settings.isPublic = true')
                .orderBy('post.createdAt', 'DESC')

            return await paginate(queryBuilderForPremium, options)
        }

        return result
    }

    async explorePosts(options: IPaginationOptions): Promise<PostDetailPagination> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')

        queryBuilder
            .innerJoinAndSelect('post.medias', 'media')
            .innerJoin('post.settings', 'settings')
            .where('settings.isPublic = true')
            .orderBy('post.createdAt', 'DESC')

        const result = await paginate(queryBuilder, options)

        return result
    }

    async countPostByUsername(username: string): Promise<number> {
        return await this.postsRepository.countBy({ user: { profile: { username } } })
    }

    async likePost(userId: number, postId: number): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user', 'user.profile'] })
        if (!post) {
            throw new NotFoundException('Post not found!')
        }

        // save like record
        await this.reactionsService.likePost(userId, post)

        // increase likes count by 1
        await this.postsRepository.update({ id: post.id }, { likesCount: ++post.likesCount })

        return { message: "Post liked !" }
    }

    async dislikePost(userId: number, postId: number): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user'] })
        if (!post) {
            throw new NotFoundException('Post not found!')
        }

        // save like record
        await this.reactionsService.dislikePost(userId, post)

        // decrease likes count by 1
        await this.postsRepository.update({ id: post.id }, { likesCount: --post.likesCount })

        return { message: "Post disliked !" }
    }

    async savePost(userId: number, postId: number): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user', 'user.profile'] })
        if (!post) {
            throw new NotFoundException('Post not found!')
        }



        return await this.reactionsService.savePost(userId, post)
    }

    async unbookmarkPost(userId: number, postId: number): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user'] })
        if (!post) {
            throw new NotFoundException('Post not found!')
        }

        return await this.reactionsService.unbookmark(userId, post)
    }

    async commentOnPost(userId: number, postId: number, cmt: NewCommentDto): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user', 'user.profile'] })
        if (!post) {
            throw new NotFoundException('Post not found!')
        }

        // save like record
        await this.reactionsService.commentOnPost(userId, post, cmt.content)

        // increase comments count by 1
        await this.postsRepository.update({ id: post.id }, { commentsCount: ++post.commentsCount })

        return { message: `You have commented on this post successfully` }
    }

    async changePostSettings(userId: number, postId: number, settings: PostSettingDto): Promise<MessageDto> {
        const post = await this.postsRepository.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['settings']
        })

        if (!post) {
            throw new NotFoundException('Post not found!')
        }

        await this.postSettingsRepository.update({ id: post.settings.id }, settings)

        return { message: `Post settings updated` }
    }
}
