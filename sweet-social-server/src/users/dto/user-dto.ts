import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Gender } from "../entities/profile.entity"

export class ProfileDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    name: string

    @ApiPropertyOptional()
    avatar: string

    @ApiPropertyOptional()
    bio: string

    @ApiPropertyOptional({ type: Gender, enum: Gender })
    gender: Gender
}

export class UserDto {
    @ApiProperty()
    email: string

    @ApiProperty()
    isVerified: boolean

    @ApiProperty()
    profile: ProfileDto
}

export class UserStatistics {
    @ApiProperty()
    post: number

    @ApiProperty()
    followers: number

    @ApiProperty()
    following: number
}

export class UserDetailDto extends UserDto {
    @ApiProperty({ type: UserStatistics })
    userStats: UserStatistics

    @ApiPropertyOptional()
    followed?: boolean
}