import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PostReactionDto } from './dto/post-reaction.dto';
import { ReactionsService } from './reactions.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationCommentDto } from './dto/comment.dto';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get reactions of user on a post' })
    @ApiResponse({ type: PostReactionDto })
    @Get('/post/user-reaction/:postId')
    async getPostReaction(@Request() req, @Param('postId') postId: number): Promise<PostReactionDto> {
        const userId: number = req['user'].id
        return this.reactionsService.getPostReactionsByUser(userId, postId)
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get comments on a post' })
    @ApiResponse({ type: PaginationCommentDto })
    @Get('/post/comments/:postId')
    async getPostComments(
        @Param('postId') postId: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<PaginationCommentDto> {
        return this.reactionsService.getPostComments(postId, { page, limit })
    }
}
