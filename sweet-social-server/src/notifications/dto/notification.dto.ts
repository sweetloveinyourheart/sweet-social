import { ApiProperty } from "@nestjs/swagger"
import { ProfileDto } from "src/users/dto/user-dto"

class NotificationPostDto {
    @ApiProperty()
    id: number
}

class NotificationSenderDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    profile: ProfileDto
}

export class NotificationDto {
    @ApiProperty()
    content: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    isRead: boolean

    @ApiProperty()
    post: NotificationPostDto

    @ApiProperty()
    sender: NotificationSenderDto
}