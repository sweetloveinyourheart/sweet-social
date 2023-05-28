import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto, CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Gender } from '../entities/profile.entity';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 50)
    bio?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(Gender)
    @Length(3, 50)
    gender?: Gender

    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 50)
    name?: string

    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 50)
    username?: string
}
