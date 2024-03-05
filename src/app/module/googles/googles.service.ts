import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { ConfigType } from '@nestjs/config';
import googleConfig from '../../../config/google.config';
import * as fs from 'fs';
@Injectable()
export class GooglesService {
  private drives: drive_v3.Drive;

  constructor(
    @Inject(googleConfig.KEY)
    private readonly configService: ConfigType<typeof googleConfig>,
  ) {
    this.auth();
  }

  private auth() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: this.configService.google.privateKey,
        client_email: this.configService.google.clientEmail,
      },
      scopes: [process.env.SCOPES_DRIVE],
    });
    const drives = google.drive({ version: 'v3', auth });
    this.drives = drives;
  }

  async downLoadFile(fileId: string): Promise<void> {  
    const filePath = process.env.FILE_PATH;
    const fileStream = fs.createWriteStream(filePath);
  
    try {
      const response = await this.drives.files.export({
        fileId: fileId,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        alt: 'media',
      }, {
        responseType: 'stream',
      });
  
      response.data.pipe(fileStream);
  
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
