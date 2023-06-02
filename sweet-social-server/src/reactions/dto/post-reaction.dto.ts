import { ApiProperty } from "@nestjs/swagger";

export class PostReactionDto {
    @ApiProperty()
    liked: boolean

    @ApiProperty()
    saved: boolean
}