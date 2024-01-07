import { IsNumber } from 'class-validator';

export class SetThresholdDto {
  @IsNumber()
  minTemperature: number;

  @IsNumber()
  maxTemperature: number;

  @IsNumber()
  minHumidity: number;

  @IsNumber()
  maxHumidity: number;
}
