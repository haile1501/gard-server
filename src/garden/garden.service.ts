import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Zone } from './schemas/zone.schema';
import { Model } from 'mongoose';
import { ZONE_NOT_FOUND } from 'src/constant/error.constant';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZoneDto } from './dto/create-zone.dto';
import { Device } from './schemas/device.schema';
import { CreateGardenDto } from './dto/create-garden.dto';
import { Garden } from './schemas/garden.schema';
import { UserService } from 'src/user/user.service';
import { TaskService } from 'src/task/task.service';
import { SetThresholdDto } from './dto/set-threshold.dto';

@Injectable()
export class GardenService {
  constructor(
    @InjectModel(Zone.name) private zoneModel: Model<Zone>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(Garden.name) private gardenModel: Model<Garden>,
    private userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async getAllZones(gardenId: string) {
    const garden = await this.gardenModel.findById(gardenId);
    return this.zoneModel.find({ garden });
  }

  getAllZoneWithActiveSchedule() {
    return this.zoneModel.find({
      $or: [{ isAutoLight: true }, { isAutoWater: true }],
    });
  }

  async getZone(zoneId: string) {
    const zone = await this.zoneModel.findById(zoneId);
    if (!zone) {
      throw new NotFoundException(ZONE_NOT_FOUND);
    }

    return zone;
  }

  async updateZone(zoneId: string, updateZoneDto: UpdateZoneDto) {
    const zone = await this.zoneModel.findByIdAndUpdate(
      zoneId,
      { $set: updateZoneDto },
      { new: true },
    );
    if (!zone) {
      throw new NotFoundException(ZONE_NOT_FOUND);
    }

    return zone;
  }

  async createZone(createZoneDto: CreateZoneDto) {
    const garden = await this.gardenModel.findById(createZoneDto.gardenId);
    if (!garden) {
      throw new NotFoundException(`Garden ${createZoneDto.gardenId} not found`);
    }
    const device = await this.deviceModel.findById(createZoneDto.deviceId);
    if (!device) {
      throw new NotFoundException(`Device ${createZoneDto.deviceId} not found`);
    }
    if (!device.isAvailable) {
      throw new BadRequestException(`Device ${device._id} is already used`);
    }
    const zone = await this.zoneModel.create({
      ...createZoneDto,
      garden,
      device,
    });
    device.isAvailable = false;
    await device.save();
    return zone;
  }

  async createGarden(createGardenDto: CreateGardenDto, userId: string) {
    const user = await this.userService.findById(userId);
    return this.gardenModel.create({ ...createGardenDto, user });
  }

  async registerDevice(deviceMacAdress: string) {
    const existingDevice = await this.deviceModel.findOne({
      macAddress: deviceMacAdress,
    });

    if (!existingDevice) {
      const device = await this.deviceModel.create({
        macAddress: deviceMacAdress,
      });
      return device;
    }

    return existingDevice;
  }

  async deleteZone(zoneId: string) {
    const zone = await this.zoneModel.findById(zoneId);
    if (!zone) {
      throw new NotFoundException(`Zone ${zoneId} not found`);
    }
    const device = await this.deviceModel.findById(zone.device);
    device.isAvailable = true;
    await Promise.all([device.save(), zone.deleteOne()]);
    return zone;
  }

  getNotUsedDevices() {
    return this.deviceModel.find({ isAvailable: true });
  }

  async switchLight(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      isLightOn: turn === 'on',
    });
    const device = await this.deviceModel.findById(zone.device);
    this.taskService.switchLight(device.macAddress, turn);
  }

  async switchWater(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      isWatering: turn === 'on',
    });
    this.taskService.switchWater(zone.device.macAddress, turn);
  }

  async switchLightSchedule(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      isAutoLight: turn === 'on',
    });
    this.taskService.switchLightSchedule(zone.device.macAddress, turn);
  }

  async switchWaterSchedule(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      isAutoWater: turn === 'on',
    });
    this.taskService.switchWaterSchedule(zone.device.macAddress, turn);
  }

  async getMyGarden(userId: string) {
    const user = await this.userService.findById(userId);
    return this.gardenModel.findOne({ user });
  }

  async getDeviceOfZone(zoneId: string) {
    const zone = await this.zoneModel.findById(zoneId);
    return this.deviceModel.findOne({ zone });
  }

  async setThreshold(zoneId: string, setThresholdDto: SetThresholdDto) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      $set: { thresholdNoti: true, ...setThresholdDto },
    });
    if (!zone) {
      throw new NotFoundException(`Zone ${zoneId} not found`);
    }
    return zone;
  }

  async switchTempThresholdNoti(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      $set: { tempThresholdNoti: turn === 'on' },
    });
    if (!zone) {
      throw new NotFoundException(`Zone ${zoneId} not found`);
    }
    return zone;
  }

  async switchHumidThresholdNoti(zoneId: string, turn: string) {
    const zone = await this.zoneModel.findByIdAndUpdate(zoneId, {
      $set: { humidThresholdNoti: turn === 'on' },
    });
    if (!zone) {
      throw new NotFoundException(`Zone ${zoneId} not found`);
    }
    return zone;
  }
}
