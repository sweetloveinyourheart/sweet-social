import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UserDto } from "src/users/dto/user-dto"
import { PostDto } from "./post.dto"
import { PaginationDto } from "src/common/dto/pagination.dto"

export class PostDetailDto extends PostDto {
    @ApiProperty({ type: UserDto })
    user: UserDto
}

export class PostDetailPagination extends PaginationDto<PostDetailDto> {
    @ApiProperty({ type: [PostDetailDto] })
    items: PostDetailDto[]
}