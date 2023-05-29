import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Media, MediaType } from './entities/media.entity';
import { NewPostDto } from './dto/new-post.dto';
import { GcpBucketService } from 'src/gcp-bucket/gcp-bucket.service';
import { MessageDto } from 'src/common/dto/message.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { PaginationPostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
        @InjectRepository(Media) private readonly mediasRepository: Repository<Media>,
        private readonly gcpBucketService: GcpBucketService
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

        const newPost = this.postsRepository.create({
            caption: post.caption,
            medias,
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

        return await paginate(queryBuilder, options)
    }

    async getUserPosts(username: string, options: IPaginationOptions): Promise<PaginationPostDto> {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
        queryBuilder
            .innerJoinAndSelect('post.medias', 'media')
            .where('post.user.id = :userId', { username })

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
}
