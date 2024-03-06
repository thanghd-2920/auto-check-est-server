import { Controller, Post, Body, HttpException, HttpStatus, Res} from '@nestjs/common';
import { Response } from 'express';
import { SpreadsheetsService } from './spreadsheets.service';
import { CompareRequestDto } from './dto/compare-request.dto';

@Controller('api/v1/spreadsheets')
export class SpreadsheetsController {
  constructor(private readonly spreadsheetsService: SpreadsheetsService) { }

  @Post("/checking_estimate")
  checkingEstimate(@Body() compareRequest: CompareRequestDto, @Res() res: Response) {
    try {
      const spreadSheetId = compareRequest.spreadSheetId;
      const informationCompare = compareRequest.informationCompare;

      const data = {
        spreadSheetId,
        informationCompare,
      };

      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      throw new HttpException(error.message, error.HttpStatus);
    }
  }
}
