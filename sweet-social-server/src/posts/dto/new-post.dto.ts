import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

class NewPostSettingDto {
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    canComment?: boolean

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    isPublic?: boolean

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    showLikeAndViewCounts?: boolean
}

export class NewPostDto extends NewPostSettingDto {
    @ApiProperty()
    @IsString()
    caption: string

    @ApiProperty({ type: 'array', minItems: 1, maxItems: 10, items: { format: 'binary', type: 'string' } })
    medias: string[]
}