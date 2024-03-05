import { IsNotEmpty, IsString } from 'class-validator';

export class GetRowsDto {
  @IsString()
  @IsNotEmpty()
  spreadSheetId: string;
}
