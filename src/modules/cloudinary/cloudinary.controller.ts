import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../../guard/admin-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@UseGuards(AdminAuthGuard)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { filePath?: string },
  ) {
    if (!file) {
      throw new BadRequestException({
        message: 'File is required',
      });
    }
    return this.cloudinaryService.uploadFile({
      file,
      filePath: body?.filePath,
    });
  }
}
