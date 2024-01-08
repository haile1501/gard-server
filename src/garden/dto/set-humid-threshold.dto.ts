import { IsNumber } from 'class-validator';

export class SetHumidThresholdDto {
  @IsNumber()
  minHumidity: number;

  @IsNumber()
  maxHumidity: number;
}
