import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, Length, ValidateNested } from "class-validator"

export class CreateProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 50)
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 50)
    username: string
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @ValidateNested()
    profile: CreateProfileDto
}
