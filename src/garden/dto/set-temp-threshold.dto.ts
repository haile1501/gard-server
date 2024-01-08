import { IsNumber } from 'class-validator';

export class SetTempThresholdDto {
  @IsNumber()
  minTemperature: number;

  @IsNumber()
  maxTemperature: number;
}
