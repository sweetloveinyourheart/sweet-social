import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "src/users/dto/user-dto"

export class ChatboxMessageDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    content: string

    @ApiProperty({ type: UserDto })
    user: UserDto

    @ApiProperty()
    createdAt: Date
}

export class ChatboxDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    chatboxId: string

    @ApiProperty({ type: [ChatboxMessageDto] })
    messages: ChatboxMessageDto[]

    @ApiProperty({ type: [UserDto] })
    members: UserDto[]

    @ApiProperty()
    createdAt: Date
}