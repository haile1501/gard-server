import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GardenService } from 'src/garden/garden.service';
import { CreateLightScheduleDto } from './dto/create-light-schedule.dto';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(forwardRef(() => GardenService))
    private readonly gardenService: GardenService,
    @Inject('GARDEN') private readonly client: ClientProxy,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  async createLightSchedule(createLightScheduleDto: CreateLightScheduleDto) {
    await this.gardenService.updateZone(
      createLightScheduleDto.zoneId,
      createLightScheduleDto,
    );
    const device = await this.gardenService.getDeviceOfZone(
      createLightScheduleDto.zoneId,
    );
    const { lightStartTime, lightTime } = createLightScheduleDto;
    const date = new Date(lightStartTime);
    this.client.emit(
      `${device.macAddress}-set_light_schedule`,
      JSON.stringify({
        hour: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds(),
        lightTime,
      }),
    );
  }

  async createIrrigationSchedule(
    createIrrigationScheduleDto: CreateIrrigationScheduleDto,
  ) {
    await this.gardenService.updateZone(
      createIrrigationScheduleDto.zoneId,
      createIrrigationScheduleDto,
    );
    const device = await this.gardenService.getDeviceOfZone(
      createIrrigationScheduleDto.zoneId,
    );
    const { irrigationStartTime, waterAmount } = createIrrigationScheduleDto;
    const date = new Date(irrigationStartTime);
    this.client.emit(
      `${device.macAddress}-set_light_schedule`,
      JSON.stringify({
        hour: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds(),
        waterAmount,
      }),
    );
  }

  switchLight(deviceMacAddress: string, turn: string) {
    this.client.emit(`${deviceMacAddress}-light`, turn);
  }

  switchWater(deviceMacAddress: string, turn: string) {
    this.client.emit(`${deviceMacAddress}-water`, turn);
  }

  switchLightSchedule(deviceMacAddress: string, turn: string) {
    this.client.emit(`${deviceMacAddress}-light_schedule`, turn);
  }

  switchWaterSchedule(deviceMacAddress: string, turn: string) {
    this.client.emit(`${deviceMacAddress}-water_schedule`, turn);
  }
}
