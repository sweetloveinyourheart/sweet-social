import { ApiProperty } from "@nestjs/swagger"

export class NotificationDto {
    @ApiProperty()
    content: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    isRead: boolean
}