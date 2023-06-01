import { ApiProperty } from "@nestjs/swagger"
import { UserProfileDto } from "src/users/dto/user-dto"
import { PostDto } from "./post.dto"
import { PaginationDto } from "src/common/dto/pagination.dto"

export class PostDetailDto extends PostDto {
    @ApiProperty({ type: UserProfileDto })
    user: UserProfileDto
}

export class PostDetailPagination extends PaginationDto<PostDetailDto> {
    @ApiProperty({ type: [PostDetailDto] })
    items: PostDetailDto[]
}