import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class OAuthDto {
    @ApiProperty()
    @IsNotEmpty()
    token: string
}