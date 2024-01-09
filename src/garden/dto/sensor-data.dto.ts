import { IsNumber, IsString } from 'class-validator';

export class SensorDataDto {
  @IsString()
  macAddress: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}
