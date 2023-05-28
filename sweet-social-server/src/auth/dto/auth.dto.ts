import { ApiProperty } from "@nestjs/swagger"

export class RefreshTokenDto {
    @ApiProperty()
    accessToken: string
}

export class AuthDto extends RefreshTokenDto {
    @ApiProperty()
    refreshToken: string
}

export class SignOutDto {
    @ApiProperty()
    message: string

    @ApiProperty()
    time: string
}