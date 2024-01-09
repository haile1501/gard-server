import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  UseGuards,
  Req,
  Query,
  Sse,
} from '@nestjs/common';
import { Request } from 'express';
import { GardenService } from './garden.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateGardenDto } from './dto/create-garden.dto';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { SetHumidThresholdDto } from './dto/set-humid-threshold.dto';
import { SetTempThresholdDto } from './dto/set-temp-threshold.dto';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SensorDataDto } from './dto/sensor-data.dto';

@Controller('garden')
export class GardenController {
  constructor(
    private readonly gardenService: GardenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(HttpAuthGuard)
  @Post()
  createGarden(
    @Body() createGardenDto: CreateGardenDto,
    @Req() request: Request,
  ) {
    const userId = request['user']._id;
    return this.gardenService.createGarden(createGardenDto, userId);
  }

  @UseGuards(HttpAuthGuard)
  @Get(':gardenId/zone')
  getAllZones(@Param('gardenId') gardenId: string) {
    return this.gardenService.getAllZones(gardenId);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone')
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.gardenService.createZone(createZoneDto);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone/:zoneId')
  updateZone(
    @Body() updateZoneDto: UpdateZoneDto,
    @Param('zoneId') zoneId: string,
  ) {
    return this.gardenService.updateZone(zoneId, updateZoneDto);
  }

  @UseGuards(HttpAuthGuard)
  @Delete('zone/:zoneId')
  deleteZone(@Param('zoneId') zoneId: string) {
    return this.gardenService.deleteZone(zoneId);
  }

  @UseGuards(HttpAuthGuard)
  @Get(':gardenId/device')
  getNotUsedDevices() {
    return this.gardenService.getNotUsedDevices();
  }

  @UseGuards(HttpAuthGuard)
  @Post(':gardenId/zone/:zoneId/light')
  switchLight(@Query('turn') turn: string, @Param('zoneId') zoneId: string) {
    this.gardenService.switchLight(zoneId, turn);
  }

  @UseGuards(HttpAuthGuard)
  @Post(':gardenId/zone/:zoneId/water')
  switchWater(@Query('turn') turn: string, @Param('zoneId') zoneId: string) {
    this.gardenService.switchWater(zoneId, turn);
  }

  @UseGuards(HttpAuthGuard)
  @Post(':gardenId/zone/:zoneId/light-schedule')
  switchLightSchedule(
    @Query('turn') turn: string,
    @Param('zoneId') zoneId: string,
  ) {
    this.gardenService.switchLightSchedule(zoneId, turn);
  }

  @UseGuards(HttpAuthGuard)
  @Post(':gardenId/zone/:zoneId/water-schedule')
  switchhWaterSchedule(
    @Query('turn') turn: string,
    @Param('zoneId') zoneId: string,
  ) {
    this.gardenService.switchWaterSchedule(zoneId, turn);
  }

  @UseGuards(HttpAuthGuard)
  @Get('my-garden')
  getMyGarden(@Req() request: Request) {
    const userId = request['user']._id;
    return this.gardenService.getMyGarden(userId);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone/:zoneId/temp-threshold')
  setTempThreshold(
    @Param('zoneId') zoneId: string,
    @Body() setTempThresholdDto: SetTempThresholdDto,
  ) {
    return this.gardenService.setTempThreshold(zoneId, setTempThresholdDto);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone/:zoneId/humid-threshold')
  setHumidThreshold(
    @Param('zoneId') zoneId: string,
    @Body() setHumidThresholdDto: SetHumidThresholdDto,
  ) {
    return this.gardenService.setHumidThreshold(zoneId, setHumidThresholdDto);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone/:zoneId/temp-threshold-noti')
  switchTempThresholdNoti(
    @Param('zoneId') zoneId: string,
    @Query('turn') turn: string,
  ) {
    return this.gardenService.switchTempThresholdNoti(zoneId, turn);
  }

  @UseGuards(HttpAuthGuard)
  @Post('zone/:zoneId/humid-threshold-noti')
  switchHumidThresholdNoti(
    @Param('zoneId') zoneId: string,
    @Query('turn') turn: string,
  ) {
    return this.gardenService.switchHumidThresholdNoti(zoneId, turn);
  }

  @MessagePattern('device-register')
  handleDeviceRegister(@Payload() deviceMacAddress: string) {
    return this.gardenService.registerDevice(deviceMacAddress);
  }

  @MessagePattern('sensor-data')
  async handleReceiveMoisture(@Payload() data: SensorDataDto) {
    const zone = await this.gardenService.getZoneByDeviceMacAdress(
      data.macAddress,
    );
    this.eventEmitter.emit('sensor-data', { id: zone._id, ...data });
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'sensor-data').pipe(
      map((data) => {
        return { data } as MessageEvent;
      }),
    );
  }
}
