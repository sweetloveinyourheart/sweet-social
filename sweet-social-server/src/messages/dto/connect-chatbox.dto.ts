import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SingleConnectDto {
    @ApiProperty()
    @IsNotEmpty()
    recipientId: number
}

export class SingleChatboxDto {
    @ApiProperty()
    chatboxId: string
}