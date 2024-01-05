import { Module } from '@nestjs/common';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Garden, GardenSchema } from './schemas/garden.schema';
import { Zone, ZoneSchema } from './schemas/zone.schema';
import { Device, DeviceSchema } from './schemas/device.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Garden.name, schema: GardenSchema },
      { name: Zone.name, schema: ZoneSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [GardenController],
  providers: [GardenService],
  exports: [GardenService],
})
export class GardenModule {}
