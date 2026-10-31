import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Konfigurasi multer: simpan ke /uploads dengan nama unik
const multerStorage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${ext}`);
  },
});

const multerFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, accept: boolean) => void,
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Tipe file tidak didukung. Hanya JPEG, PNG, WebP, GIF.'), false);
  }
};

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * POST /api/media/upload
   * Upload file gambar (memerlukan autentikasi JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage,
      fileFilter: multerFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Tidak ada file yang diunggah');
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/api`;

    const media = await this.mediaService.saveFile(file, baseUrl);
    return media;
  }

  /**
   * GET /api/media
   * Ambil daftar semua media yang sudah diupload (memerlukan autentikasi JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}/api`;
    return this.mediaService.findAll(baseUrl);
  }

  /**
   * DELETE /api/media/:filename
   * Hapus file media berdasarkan nama file (memerlukan autentikasi JWT)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('filename') filename: string) {
    await this.mediaService.deleteFile(filename);
  }
}
