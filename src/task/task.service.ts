import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { GardenService } from 'src/garden/garden.service';
import { CreateLightScheduleDto } from './dto/create-light-schedule.dto';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(forwardRef(() => GardenService))
    private readonly gardenService: GardenService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('GARDEN') private readonly client: ClientProxy,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  private getCronTime(date: Date) {
    return `0 ${date.getMinutes()} ${date.getHours()} * * *`;
  }

  async createLightSchedule(createLightScheduleDto: CreateLightScheduleDto) {
    const zone = await this.gardenService.updateZone(
      createLightScheduleDto.zoneId,
      createLightScheduleDto,
    );
  }

  async createIrrigationSchedule(
    createIrrigationScheduleDto: CreateIrrigationScheduleDto,
  ) {
    const zone = await this.gardenService.updateZone(
      createIrrigationScheduleDto.zoneId,
      createIrrigationScheduleDto,
    );
  }

  switchLight(deviceMacAddress: string, turn: string) {
    console.log(deviceMacAddress);
    this.client.emit(`${deviceMacAddress}-light`, turn);
  }

  switchWater(deviceMacAddress: string, turn: string) {}

  switchLightSchedule(deviceMacAddress: string, turn: string) {}

  switchWaterSchedule(deviceMacAddress: string, turn: string) {}
}
