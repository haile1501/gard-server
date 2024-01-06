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
} from '@nestjs/common';
import { Request } from 'express';
import { GardenService } from './garden.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateGardenDto } from './dto/create-garden.dto';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('garden')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

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
  deleteZone(@Param() zoneId: string) {
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

  @MessagePattern('device-register')
  handleDeviceRegister(@Payload() deviceMacAddress: string) {
    return this.gardenService.registerDevice(deviceMacAddress);
  }
}
