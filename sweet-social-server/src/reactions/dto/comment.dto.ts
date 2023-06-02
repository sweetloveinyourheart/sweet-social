import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { UserDto } from "src/users/dto/user-dto";

export class NewCommentDto {
    @ApiProperty()
    @IsString()
    content: string
}

export class CommentDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    content: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty({ type: UserDto })
    user: UserDto
}

export class PaginationCommentDto extends PaginationDto<CommentDto> {
    @ApiProperty({ type: [CommentDto] })
    items: CommentDto[];
}