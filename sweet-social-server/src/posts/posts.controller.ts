import { BadRequestException, Body, Controller, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPostDto } from './dto/new-post.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from 'src/auth/dto/message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostDto } from './dto/post.dto';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload your post' })
  @UseInterceptors(FilesInterceptor('medias', undefined , {
    fileFilter(req, file, callback) {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        callback(null, true); // Accept the file with image format
      } else {
        callback(new BadRequestException('Invalid file type'), false); // Reject the file
      }
    },
  }))
  @Post('/new')
  async createNewPost(@Request() req, @UploadedFiles() files: Express.Multer.File[],@Body() post: NewPostDto): Promise<MessageDto> {
    const userId = req['user'].id
    return await this.postsService.createNewPost(userId, post, files)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get personal posts" })
  @ApiResponse({ type: PostDto, status: 200 })
  @Get('/personal/get-posts')
  async getPersonalPosts(@Request() req): Promise<PostDto[]> {
    const userId = req['user'].id
    return await this.postsService.getPersonalPosts(userId)
  }
}
