import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

class BasicProfileDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    name: string

    @ApiProperty({ nullable: true })
    avatar: string | null
}

export class BasicUserDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    profile: BasicProfileDto
}