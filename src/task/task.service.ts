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
    if (this.schedulerRegistry.doesExist('cron', `${zone.id}-light`)) {
      this.schedulerRegistry.deleteCronJob(`${zone.id}-light`);
    }
    const newLightJob = CronJob.from({
      cronTime: this.getCronTime(zone.lightStartTime),
      onTick: () => {
        this.logger.log('turn-on-light');
        this.client.emit('light', 'on');
        setTimeout(() => {
          this.logger.log('turn-off-light');
          this.client.emit('light', 'off');
        }, zone.lightTime * 1000);
      },
      timeZone: 'system',
    });
    this.schedulerRegistry.addCronJob(`${zone.id}-light`, newLightJob);
    newLightJob.start();
  }

  async createIrrigationSchedule(
    createIrrigationScheduleDto: CreateIrrigationScheduleDto,
  ) {
    const zone = await this.gardenService.updateZone(
      createIrrigationScheduleDto.zoneId,
      createIrrigationScheduleDto,
    );

    if (this.schedulerRegistry.doesExist('cron', `${zone.id}-irrigation`)) {
      this.schedulerRegistry.deleteCronJob(`${zone.id}-irrigation`);
    }

    const newIrrigationJob = CronJob.from({
      cronTime: this.getCronTime(zone.irrigationStartTime),
      onTick: () => {
        this.client.emit('start-watering', {
          waterAmount: zone.waterAmount,
        });
      },
      timeZone: 'system',
    });
    this.schedulerRegistry.addCronJob(
      `${zone.id}-irrigation`,
      newIrrigationJob,
    );
    newIrrigationJob.start();
  }

  switchLight(deviceMacAddress: string, turn: string) {
    console.log(deviceMacAddress);
    this.client.emit(`${deviceMacAddress}-light`, turn);
  }

  switchWater(deviceMacAddress: string, turn: string) {}

  switchLightSchedule(deviceMacAddress: string, turn: string) {}

  switchWaterSchedule(deviceMacAddress: string, turn: string) {}
}
