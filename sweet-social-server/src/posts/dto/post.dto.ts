import { ApiExtraModels, ApiProperty } from "@nestjs/swagger"
import { MediaType } from "../entities/media.entity"
import { PaginationDto } from "src/common/dto/pagination.dto"
import { UserProfileDto } from "src/users/dto/user-dto"

class MediaDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    mediaType: MediaType

    @ApiProperty()
    mediaUrl: string

    @ApiProperty()
    createdAt: Date
}

export class PostDto {
    @ApiProperty()
    id: number
    
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

@ApiExtraModels(PostDto)
export class PaginationPostDto extends PaginationDto<PostDto> {
    @ApiProperty({ type: [PostDto] })
    items: PostDto[]
}

export class PostDetailDto {
    @ApiProperty()
    id: number

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

    @ApiProperty({ type: UserProfileDto })
    user: UserProfileDto
}