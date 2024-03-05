import { Module } from '@nestjs/common';
import { HandleFilesService } from './handle-files.service';
import { HandleFilesController } from './handle-files.controller';
import { GooglesService } from '../googles/googles.service';

@Module({
  controllers: [HandleFilesController],
  providers: [HandleFilesService, GooglesService]
})
export class HandleFilesModule {}
