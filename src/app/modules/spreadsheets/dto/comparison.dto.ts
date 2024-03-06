import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

const validDomainValues = ["Backend", "Frontend", "QA", "IOS", "Android", "All_dev"];
const validFormularValues = ["=", "<", ">", "<=", "=>", "+-"];
const validUnitValues = ["%", "man_days"];
export class ComparisonDto {
  @ApiProperty({
    default: "Backend"
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(validDomainValues)
  domainLeft: string;
  
  @ApiProperty({
    default: "Frontend"
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(validDomainValues)
  domainRight: string;

  @ApiProperty({
    default: "%"
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(validUnitValues)
  unit: string;

  @ApiProperty({
    default: "<="
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(validFormularValues)
  fomular: string;

  @ApiProperty({
    default: "1.2"
  })
  @IsNotEmpty()
  @IsNumber()
  ratio: number;
}
