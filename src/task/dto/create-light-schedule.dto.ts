import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateLightScheduleDto {
  @IsString()
  zoneId: string;

  @IsDate()
  lightStartTime: Date;

  @IsNumber()
  lightTime: number;
}
