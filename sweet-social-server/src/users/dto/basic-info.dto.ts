import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UserStatistics } from "./user-dto"

class BasicProfileDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    name: string

    @ApiProperty({ nullable: true })
    avatar: string | null
}

export class ShortUserInfo {
    @ApiProperty()
    id: number

    @ApiProperty()
    profile: BasicProfileDto
}

export class BasicUserDto extends ShortUserInfo {
    @ApiProperty({ type: UserStatistics })
    userStats: UserStatistics

    @ApiPropertyOptional()
    followed: boolean
}