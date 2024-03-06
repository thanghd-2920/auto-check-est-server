import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GooglesModule } from './app/modules/googles/googles.module';
import { HandleFilesModule } from './app/modules/spreadsheets/spreadsheets.module';
import googleConfig from './config/google/google.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [googleConfig]
    }),
    GooglesModule,
    HandleFilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
