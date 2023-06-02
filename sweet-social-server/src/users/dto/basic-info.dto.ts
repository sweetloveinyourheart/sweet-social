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

export class BasicUserDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    profile: BasicProfileDto

    @ApiProperty({ type: UserStatistics })
    userStats: UserStatistics

    @ApiPropertyOptional()
    followed: boolean
}