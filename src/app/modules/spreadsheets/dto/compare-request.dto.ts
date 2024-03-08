import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ComparisonDto } from './comparison.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CompareRequestDto {
  @ApiProperty({
    default: "pjXCI3XO18mtEN5Hgyb5KJsxlmobEc1CFw2FrM"
  })
  @IsNotEmpty()
  @IsString()
  spreadSheetId: string;

  @ApiProperty({ type: [ComparisonDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ComparisonDto)
  informationCompare: ComparisonDto[];
}
