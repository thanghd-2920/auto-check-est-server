import { Module } from '@nestjs/common';
import { GooglesService } from './googles.service';

@Module({
  providers: [GooglesService]
})
export class GooglesModule {}
