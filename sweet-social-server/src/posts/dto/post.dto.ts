import { ApiProperty } from "@nestjs/swagger"
import { MediaType } from "../entities/media.entity"

class MediaDto {
    @ApiProperty()
    mediaType: MediaType

    @ApiProperty()
    mediaUrl: string

    @ApiProperty()
    createdAt: Date
}

export class PostDto {
    @ApiProperty()
    caption: string

    @ApiProperty()
    likesCount: number

    @ApiProperty()
    commentsCount: number

    @ApiProperty()
    createdAt: Date

    @ApiProperty({ type: [MediaDto] })
    medias: MediaDto[]
}