import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatBox } from './entities/Chatbox.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/Message.entity';
import { SingleChatboxDto, SingleConnectDto } from './dto/connect-chatbox.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChatboxDto, ChatboxInfoDto, PaginationMessageDto } from './dto/chatbox.dto';
import { MessagePayload } from './payload/chatbox.payload';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MessageDto } from 'src/common/dto/message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(ChatBox) private readonly chatboxesRepository: Repository<ChatBox>,
        @InjectRepository(Message) private readonly messagesRepository: Repository<Message>
    ) { }

    async connectToSingleChatbox(userId: number, boxToConnent: SingleConnectDto): Promise<SingleChatboxDto> {
        const { recipientId } = boxToConnent

        const querybuilder = this.chatboxesRepository.createQueryBuilder('chatbox');
        const chatbox = await querybuilder
            .leftJoinAndSelect('chatbox.members', 'members')
            .where((subQuery) => {
                const subQueryAlias = subQuery
                    .subQuery()
                    .select('cb.chatboxId')
                    .from('ChatBox', 'cb')
                    .innerJoin('cb.members', 'm')
                    .where('m.id IN (:userId, :recipientId)', { userId, recipientId })
                    .groupBy('cb.chatboxId')
                    .having('COUNT(m) = 2')
                    .getQuery();

                return `chatbox.chatboxId IN ${subQueryAlias}`;
            })
            .getOne();

        if (chatbox) {
            return { chatboxId: chatbox.chatboxId }
        }

        // if no chatbox found, create one
        const newChatbox = this.chatboxesRepository.create({
            chatboxId: uuidv4(),
            members: [{ id: userId }, { id: recipientId }]
        })

        await this.chatboxesRepository.save(newChatbox)

        return { chatboxId: newChatbox.chatboxId }
    }

    async getChatboxList(userId: number): Promise<ChatboxDto[]> {
        const querybuilder = this.chatboxesRepository.createQueryBuilder('chatbox');
        const chatboxes = await querybuilder
            .leftJoin('chatbox.messages', 'messages')
            .leftJoin('chatbox.members', 'members')
            .leftJoin('members.profile', 'profile')
            .where((subQuery) => {
                const subQueryAlias = subQuery
                    .subQuery()
                    .select('chatbox.id')
                    .from('ChatBox', 'chatbox')
                    .leftJoin('chatbox.members', 'm')
                    .where('m.id = :userId', { userId })
                    .groupBy('chatbox.id')
                    .getQuery();

                return `chatbox.id IN ${subQueryAlias}`;
            })
            .andWhere((subQuery) => {
                const subQueryAlias = subQuery // Get only one newest message to show
                    .subQuery()
                    .select('MAX(messages.createdAt)', 'maxCreatedAt')
                    .from('Message', 'messages')
                    .where('messages.chatboxId = chatbox.id')
                    .getQuery();

                return 'messages.createdAt = ' + subQueryAlias;
            })
            .orderBy('messages.createdAt', 'DESC')
            .select(['chatbox', 'members.id', 'profile', 'messages'])
            .getMany();


        return chatboxes
    }

    async getChatboxInfo(userId: number, chatboxId: string): Promise<ChatboxInfoDto> {
        // only user joined in the chatbox can get data from it
        const exist = await this.chatboxesRepository.findOneBy({ chatboxId, members: { id: userId } })
        if (!exist) throw new ForbiddenException('No permission !')

        const chatbox = await this.chatboxesRepository.findOne({
            relations: ['members', 'members.profile', 'messages', 'messages.user', 'messages.user.profile'],
            where: {
                chatboxId
            },
            select: {
                id: true,
                chatboxId: true,
                createdAt: true,
                members: {
                    id: true,
                    profile: {
                        username: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        })

        return chatbox
    }

    async getChatboxMessages(userId: number, chatboxId: string, options: IPaginationOptions): Promise<PaginationMessageDto> {
        // only user joined in the chatbox can get data from it
        const exist = await this.chatboxesRepository.findOneBy({ chatboxId, members: { id: userId } })
        if (!exist) throw new ForbiddenException('No permission !')

        const qb = this.messagesRepository.createQueryBuilder('message')
        qb
            .leftJoin('message.user', 'user')
            .innerJoin('user.profile', 'profile')
            .leftJoin('message.chatbox', 'chatbox')
            .where('chatbox.chatboxId = :chatboxId', { chatboxId })
            .orderBy('message.createdAt', 'DESC')
            .select(['message', 'user.id', 'profile'])

        return await paginate(qb, options)
    }

    async saveMessage(userId: number, message: MessagePayload): Promise<Message> {
        const chatbox = await this.chatboxesRepository.findOneBy({ chatboxId: message.chatboxId })

        const newMsg = this.messagesRepository.create({
            content: message.content,
            chatbox,
            user: {
                id: userId
            }

        })

        await this.messagesRepository.save(newMsg)

        const msg = await this.messagesRepository.findOne({
            where: { id: newMsg.id },
            relations: ['user', 'user.profile'],
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                    id: true,
                    profile: {
                        avatar: true,
                        username: true,
                        name: true
                    }
                }
            }
        })
        return msg
    }

    async getChatboxMembers(msgId: number) {
        const querybuilder = this.messagesRepository.createQueryBuilder('message')
        const msg = await querybuilder
            .leftJoin('message.chatbox', 'cb')
            .leftJoin('cb.members', 'mbs')
            .leftJoin('mbs.profile', 'mprofile')
            .where('message.id = :msgId', { msgId })
            .select(['message.id', 'cb.id', 'mbs.id', 'mprofile.username'])
            .getOne()

        return msg.chatbox.members
    }

    async deleteConversation(userId: number, chatboxId: string): Promise<MessageDto> {
        const conversation = await this.chatboxesRepository.findOne({
            relations: ['members'],
            where: {
                chatboxId,
                members: {
                    id: userId
                }
            }
        })
        if (!conversation) {
            throw new NotFoundException('Conversation not found !')
        }

        await this.chatboxesRepository.remove(conversation)

        return { message: "Conversation deleted !" }
    }
}
