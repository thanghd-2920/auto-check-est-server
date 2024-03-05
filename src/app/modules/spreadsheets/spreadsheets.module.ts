import { Module } from '@nestjs/common';
import { GooglesService } from '../googles/googles.service';
import { SpreadsheetsController } from './spreadsheets.controller';
import { SpreadsheetsService } from './spreadsheets.service';

@Module({
  controllers: [SpreadsheetsController],
  providers: [SpreadsheetsService, GooglesService]
})
export class HandleFilesModule {}
