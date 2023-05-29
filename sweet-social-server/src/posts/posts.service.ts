import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Media, MediaType } from './entities/media.entity';
import { NewPostDto } from './dto/new-post.dto';
import { GcpBucketService } from 'src/gcp-bucket/gcp-bucket.service';
import { MessageDto } from 'src/auth/dto/message.dto';

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

    async getPersonalPosts(userId: number): Promise<Post[]> {
        return await this.postsRepository.find({ where: { user: { id: userId } }, relations: ['medias'] } )
    }
}
