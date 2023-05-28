import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Gender } from "../entities/profile.entity"

export class UserDto {
    @ApiProperty()
    email: string

    @ApiProperty()
    isVerified: boolean
}

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

export class UserProfileDto extends UserDto {
    @ApiProperty()
    profile: ProfileDto
}