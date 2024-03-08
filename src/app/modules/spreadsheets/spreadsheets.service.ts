import { HttpException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as fs from 'fs';

import { GooglesService } from '../googles/googles.service';
import { REGEX } from 'src/config/settings/settings';
import { SpreadSheetError } from './interface/spreadsheet_error.interface';

const defaultSheets = new Set([
  'History of changes',
  'Technical Suggestion',
  '00_Summary',
  'Appendix',
  'Project Organization Structure',
]);

@Injectable()
export class SpreadsheetsService {
  constructor(private readonly googleService: GooglesService) {}

  downloadFile(spreadSheetId: string) {
    return this.googleService.downloadFile(spreadSheetId);
  }

  async checkingTotalEfford(spreadSheetId: string) {
    let filePath = '';
    let response = [];
    try {
      filePath = await this.googleService.downloadFile(spreadSheetId);
      const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
      const sheetNames =  workbook.SheetNames.filter(value => !defaultSheets.has(value.trim()));
      console.log(sheetNames)
      sheetNames.forEach(sheetName => {
        const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const dataTotalEffort = this.listObjectTotalEffort(sheetData);
        const totalEffotSheet = this.checkMasterData(dataTotalEffort, filePath)
        response.push({ [sheetName]: totalEffotSheet });
      })
      this.googleService.removeFile(filePath);
      return response
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
    let isFoundError = false;
    let message_error: string = '';

    for (const key in masterData) {
      if (masterData.hasOwnProperty(key)) {
        const obj = masterData[key];
        if (obj.hasOwnProperty('f') && !obj['f'].includes('$B$8')) {
          message_error = `${key} Buffer MUST be included`;
          isFoundError = true;
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
    return isFoundError ? {line_1: errors} : []
  }

  getObjectWithValue(value: string, sheetData: XLSX.WorkSheet) {
    const targetKey = Object.keys(sheetData).find(
      (key) => sheetData[key].v === value,
    );
    const targetObject = { [targetKey]: sheetData[targetKey] };
    return targetObject;
  }
}
