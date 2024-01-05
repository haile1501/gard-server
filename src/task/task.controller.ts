import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateLightScheduleDto } from './dto/create-light-schedule.dto';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('light-schedule')
  createLightSchedule(@Body() createLightScheduleDto: CreateLightScheduleDto) {
    return this.taskService.createLightSchedule(createLightScheduleDto);
  }

  @Post('irrigation-schedule')
  createIrrigationSchedule(
    @Body() createIrrigationScheduleDto: CreateIrrigationScheduleDto,
  ) {
    return this.createIrrigationSchedule(createIrrigationScheduleDto);
  }
}
