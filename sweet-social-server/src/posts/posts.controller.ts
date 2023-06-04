import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPostDto } from './dto/new-post.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from 'src/common/dto/message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationPostDto } from './dto/post.dto';
import { PostDetailDto } from './dto/post-detail.dto';
import { NewCommentDto } from '../reactions/dto/comment.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get newsfeed posts" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/newsfeed/get-all')
  async getNewsfeedPosts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    const userId = req['user'].id
    return await this.postsService.getNewsfeedPosts(userId, { page, limit })
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Explore sweetbook posts, include newest posts" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/explore/get-all')
  async explorePosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    return await this.postsService.explorePosts({ page, limit })
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
  @ApiOperation({ summary: "Get saved posts by user" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/saved/get-all')
  async getSavedPosts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    const userId = req['user'].id
    return await this.postsService.getSavedPosts(userId, { page, limit })
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user posts by username" })
  @ApiResponse({ type: PaginationPostDto, status: 200 })
  @Get('/user/:username')
  async getUserPosts(
    @Param('username') username: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationPostDto> {
    return await this.postsService.getUserPosts(username, { page, limit })
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get post by id" })
  @ApiResponse({ type: PostDetailDto, status: 200 })
  @Get('/get-by-id/:id')
  async getPostById(
    @Param('id') id: number,
  ): Promise<PostDetailDto> {
    return await this.postsService.getPostById(id)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload your post' })
  @UseInterceptors(FilesInterceptor('medias', 10, {
    fileFilter(req, file, callback) {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        callback(null, true); // Accept the file with image format
      } else {
        callback(new BadRequestException('Invalid file type'), false); // Reject the file
      }
    },
  }))
  @Post('/new')
  async createNewPost(@Request() req, @UploadedFiles() files: Express.Multer.File[], @Body() post: NewPostDto): Promise<any> {
    const userId = req['user'].id
    return await this.postsService.createNewPost(userId, post, files)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Like a post" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Post('/like/:postId')
  async likePost(@Request() req, @Param('postId') postId: number) {
    const userId = req['user'].id
    return await this.postsService.likePost(userId, postId)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Save a post" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Post('/save/:postId')
  async savePost(@Request() req, @Param('postId') postId: number) {
    const userId = req['user'].id
    return await this.postsService.savePost(userId, postId)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Comment on a post" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Post('/comment/:postId')
  async commentOnPost(@Request() req, @Param('postId') postId: number, @Body() cmt: NewCommentDto) {
    const userId = req['user'].id
    return await this.postsService.commentOnPost(userId, postId, cmt)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Dislike a post" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Delete('/dislike/:postId')
  async dislikePost(@Request() req, @Param('postId') postId: number) {
    const userId = req['user'].id
    return await this.postsService.dislikePost(userId, postId)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Unbookmark a post" })
  @ApiResponse({ type: MessageDto, status: 200 })
  @Delete('/unbookmark/:postId')
  async unbookmarkPost(@Request() req, @Param('postId') postId: number) {
    const userId = req['user'].id
    return await this.postsService.unbookmarkPost(userId, postId)
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
