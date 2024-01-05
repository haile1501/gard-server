import { IsDate, IsPositive, IsString } from 'class-validator';

export class CreateIrrigationScheduleDto {
  @IsString()
  zoneId: string;

  @IsDate()
  irrigationStartTime: Date;

  @IsPositive()
  waterAmount: number;
}
