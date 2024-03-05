import { Injectable } from '@nestjs/common';
import { GooglesService } from '../googles/googles.service';

@Injectable()
export class HandleFilesService {
  constructor(private readonly googleService: GooglesService) {}

  mapRowsToObjectList(rows: string[][]): object[] {
    const [keys, valuesStr] = rows[0];
    const values = valuesStr.split('\n');

    const result = values.map((valueRow) => {
      const valueRowArr = valueRow.split(':');
      const key = valueRowArr[0].trim();
      const value = valueRowArr[1]?.trim();

      return { [keys]: key, value };
    });

    return result;
  }

  downloadFile(spreadSheetId: string){
    return this.googleService.downLoadFile(spreadSheetId);
  }
}
