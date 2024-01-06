import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateZoneDto {
  @IsString()
  plant: string;

  @IsDate()
  @IsOptional()
  irrigationStartTime: Date;

  @IsNumber()
  @IsOptional()
  waterAmount: number;

  @IsDate()
  @IsOptional()
  lightStartTime: Date;

  @IsNumber()
  @IsOptional()
  lightTime: number;

  @IsNumber()
  @IsOptional()
  minHumidity: number;

  @IsNumber()
  @IsOptional()
  maxHumidity: number;

  @IsNumber()
  @IsOptional()
  minTemperature: number;

  @IsNumber()
  @IsOptional()
  maxTemperature: number;

  @IsBoolean()
  @IsOptional()
  isLightOn: boolean;

  @IsBoolean()
  @IsOptional()
  isWatering: boolean;

  @IsString()
  gardenId: string;

  @IsString()
  deviceId: string;
}
