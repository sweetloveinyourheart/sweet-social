import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length, ValidateNested } from 'class-validator';
import { Gender } from '../entities/profile.entity';

export class UpdateProfileDto {
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
