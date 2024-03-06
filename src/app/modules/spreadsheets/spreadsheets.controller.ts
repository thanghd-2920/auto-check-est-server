import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GetRowsDto } from './dto/get-rows.dto';
import { SpreadsheetsService } from './spreadsheets.service';

@Controller('spreadsheets')
export class SpreadsheetsController {
  constructor(private readonly spreadsheetsService: SpreadsheetsService) {}

  @Get('/download')
  async downloadFile(@Query() query: GetRowsDto){
    const { spreadSheetId } = query;
    return this.spreadsheetsService.downloadFile(spreadSheetId)
  }
}
