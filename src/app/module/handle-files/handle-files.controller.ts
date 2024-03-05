import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HandleFilesService } from './handle-files.service';
import { GetRowsDto } from './dto/get-rows.dto';

@Controller('handle-files')
export class HandleFilesController {
  constructor(private readonly handleFilesService: HandleFilesService) {}

  @Get('/download')
  async downloadFile(@Query() query: GetRowsDto){
    const { spreadSheetId } = query;

    return this.handleFilesService.downloadFile(spreadSheetId)
  }
}
