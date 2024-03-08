import { HttpException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as fs from 'fs';

import { GooglesService } from '../googles/googles.service';
import { REGEX } from 'src/config/settings/settings';
import { SpreadSheetError } from './interface/spreadsheet_error.interface';

@Injectable()
export class SpreadsheetsService {
  constructor(private readonly googleService: GooglesService) {}

  downloadFile(spreadSheetId: string) {
    return this.googleService.downloadFile(spreadSheetId);
  }

  async checkingTotalEfford(spreadSheetId: string) {
    let filePath = '';
    try {
      filePath = await this.googleService.downloadFile(spreadSheetId);
      const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
      const sheetName: string = workbook.SheetNames[3];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const dataTotalEffort = this.listObjectTotalEffort(sheetData);
      return this.checkMasterData(dataTotalEffort, filePath);
    } catch (error) {
      throw new HttpException(error.message, error.HttpStatus);
    }
  }

  listObjectTotalEffort(sheetData: XLSX.WorkSheet) {
    const keyTotalMM = Object.keys(
      this.getObjectWithValue('Total (MM)', sheetData),
    )[0];
    const number: any = parseInt(keyTotalMM.match(/\d+/)[0]);
    const regex = new RegExp(REGEX.RANGE_NUMBER.replace('{number}', number));
    const filteredData = Object.fromEntries(
      Object.entries(sheetData).filter(([key]) => key.match(regex)),
    );
    delete filteredData[keyTotalMM];
    return filteredData;
  }

  checkMasterData(masterData: XLSX.WorkSheet, filePath: string) {
    const errors = [];
    let foundError = false;
    let message_error: string = '';

    for (const key in masterData) {
      if (masterData.hasOwnProperty(key)) {
        const obj = masterData[key];
        if (obj.hasOwnProperty('f') && !obj['f'].includes('Appendix!$B$8')) {
          message_error = `${key} Buffer MUST be included`;
          foundError = true;
        } else {
          message_error = '';
        }
        const spreadSheetError: SpreadSheetError = {
          column: key,
          value: obj['v'],
          message_error: message_error,
        };
        errors.push(spreadSheetError);
      }
    }
    this.googleService.removeFile(filePath);
    return foundError ? { line_1: errors } : [];
  }

  getObjectWithValue(value: string, sheetData: XLSX.WorkSheet) {
    const targetKey = Object.keys(sheetData).find(
      (key) => sheetData[key].v === value,
    );
    const targetObject = { [targetKey]: sheetData[targetKey] };
    return targetObject;
  }
}
