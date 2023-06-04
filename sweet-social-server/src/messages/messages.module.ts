import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/Message.entity';
import { ChatBox } from './entities/Chatbox.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatBox, Message])
    ],
    providers: [
        MessagesGateway,
        MessagesService
    ],
    controllers: [MessagesController]
})
export class MessagesModule {}
