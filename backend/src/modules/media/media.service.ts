import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

@Injectable()
export class MediaService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Pastikan direktori uploads ada
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Simpan info file hasil upload dan kembalikan detail-nya.
   */
  async saveFile(
    file: Express.Multer.File,
    baseUrl: string,
  ): Promise<MediaFile> {
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    return {
      id: file.filename.split('.')[0],
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };
  }

  /**
   * Ambil semua file dari direktori uploads.
   */
  async findAll(baseUrl: string): Promise<MediaFile[]> {
    if (!fs.existsSync(this.uploadDir)) return [];

    const files = fs.readdirSync(this.uploadDir);
    return files
      .filter((f) => !f.startsWith('.'))
      .map((filename) => {
        const filePath = path.join(this.uploadDir, filename);
        const stat = fs.statSync(filePath);
        const ext = path.extname(filename).toLowerCase();

        const mimeMap: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
        };

        return {
          id: filename.split('.')[0],
          filename,
          originalName: filename,
          url: `${baseUrl}/uploads/${filename}`,
          mimeType: mimeMap[ext] || 'application/octet-stream',
          size: stat.size,
          uploadedAt: stat.birthtime,
        };
      })
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  /**
   * Hapus file dari disk berdasarkan nama file.
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File '${filename}' tidak ditemukan`);
    }
    fs.unlinkSync(filePath);
  }
}
