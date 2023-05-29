import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPostDto } from './dto/new-post.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from 'src/common/dto/message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationPostDto, PostDto } from './dto/post.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload your post' })
  @UseInterceptors(FilesInterceptor('medias', undefined, {
    fileFilter(req, file, callback) {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        callback(null, true); // Accept the file with image format
      } else {
        callback(new BadRequestException('Invalid file type'), false); // Reject the file
      }
    },
  }))
  @Post('/new')
  async createNewPost(@Request() req, @UploadedFiles() files: Express.Multer.File[], @Body() post: NewPostDto): Promise<MessageDto> {
    const userId = req['user'].id
    return await this.postsService.createNewPost(userId, post, files)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get personal posts" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/personal/get-all')
  async getPersonalPosts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    const userId = req['user'].id
    return await this.postsService.getPersonalPosts(userId, { page, limit })
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user posts by username" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/user/get-all')
  async getUserPosts(
    @Query('username') username: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    return await this.postsService.getUserPosts(username, { page, limit })
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remove post by user" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Delete('/personal/remove/:postId')
  async removePost(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number
  ) {
    const userId = req['user'].id
    return await this.postsService.removePost(userId, postId)
  }

}
