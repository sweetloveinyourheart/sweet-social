import { ApiProperty } from "@nestjs/swagger"
import { PaginationDto } from "src/common/dto/pagination.dto"
import { ShortUserInfo } from "src/users/dto/basic-info.dto"

export class ChatboxMessageDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    content: string

    @ApiProperty({ type: ShortUserInfo })
    user: ShortUserInfo

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

    @ApiProperty({ type: [ShortUserInfo] })
    members: ShortUserInfo[]

    @ApiProperty()
    createdAt: Date
}

export class ChatboxInfoDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    chatboxId: string

    @ApiProperty({ type: [ShortUserInfo] })
    members: ShortUserInfo[]

    @ApiProperty()
    createdAt: Date
}

export class PaginationMessageDto extends PaginationDto<ChatboxMessageDto> {
    @ApiProperty({ type: [ChatboxMessageDto] })
    items: ChatboxMessageDto[]
}