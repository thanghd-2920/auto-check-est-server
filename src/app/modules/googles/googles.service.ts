import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import googleConfig from '../../../config/google/google.config';
import { DOWNLOAD_FILE_INFO } from 'src/config/settings/settings';

@Injectable()
export class GooglesService {
  private drives: drive_v3.Drive;

  constructor(
    @Inject(googleConfig.KEY)
    private readonly configService: ConfigType<typeof googleConfig>,
  ) {
    this.auth();
  }

  async downloadFile(fileId: string): Promise<void> {
    const filePath = this.configService.google.filePath;
    const fileStream = fs.createWriteStream(filePath);
  
    try {
      const response = await this.drives.files.export({
        fileId: fileId,
        mimeType: DOWNLOAD_FILE_INFO.MIME_TYPE,
        alt: DOWNLOAD_FILE_INFO.ALT,
      }, {
        responseType: 'stream',
      });

      response.data.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
    } catch (error) {
      throw new HttpException(error.message, error.HttpStatus);
    }
  }

  private auth() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: this.configService.google.privateKey,
        client_email: this.configService.google.clientEmail,
      },
      scopes: [this.configService.google.scopes],
    });
    const drives = google.drive({ version: 'v3', auth });
    this.drives = drives;
  }
}
