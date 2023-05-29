import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class NewPostDto {
    @ApiProperty()
    @IsString()
    caption: string

    @ApiProperty({ type: 'array', items: { format: 'binary', type: 'string' } })
    medias: string[]
}