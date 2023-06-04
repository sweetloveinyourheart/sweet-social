import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SingleChatboxDto, SingleConnectDto } from './dto/connect-chatbox.dto';
import { ChatboxDto, ChatboxInfoDto, PaginationMessageDto } from './dto/chatbox.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from 'src/common/dto/message.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ type: SingleChatboxDto })
    @ApiOperation({ summary: 'Get single conversation with given user id' })
    @Post('connect')
    async connectToSingleChatbox(
        @Request() req,
        @Body() boxToConnect: SingleConnectDto,
    ): Promise<SingleChatboxDto> {
        const userId = req['user'].id

        return this.messagesService.connectToSingleChatbox(userId, boxToConnect);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ type: [ChatboxDto] })
    @ApiOperation({ summary: 'Get conversations by user' })
    @Get('list')
    async getChatboxList(@Request() req): Promise<ChatboxDto[]> {
        const userId = req['user'].id

        return this.messagesService.getChatboxList(userId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ type: ChatboxInfoDto })
    @ApiOperation({ summary: 'Get chatbox basic info' })
    @Get('info/:chatboxId')
    async getChatboxInfo(@Request() req, @Param('chatboxId') chatboxId: string): Promise<ChatboxInfoDto> {
        const userId = req['user'].id

        return this.messagesService.getChatboxInfo(userId, chatboxId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ type: PaginationMessageDto })
    @ApiOperation({ summary: 'Get chatbox messages' })
    @Get('get-all/:chatboxId')
    async getChatboxMessages(
        @Request() req, 
        @Param('chatboxId') chatboxId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,

    ): Promise<PaginationMessageDto> {
        const userId = req['user'].id

        return this.messagesService.getChatboxMessages(userId, chatboxId, { page, limit });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ type: MessageDto })
    @ApiOperation({ summary: 'Delete a conversation' })
    @Delete('remove/:chatboxId')
    async deleteConversation(
        @Request() req, 
        @Param('chatboxId') chatboxId: string

    ): Promise<MessageDto> {
        const userId = req['user'].id

        return this.messagesService.deleteConversation(userId, chatboxId)
    }
}
