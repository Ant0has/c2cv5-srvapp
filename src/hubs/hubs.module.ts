import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HubsService } from './hubs.service';
import { HubsController } from './hubs.controller';
import { Hub } from './hub.entity';
import { Destination } from '../destinations/destination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hub, Destination])],
  controllers: [HubsController],
  providers: [HubsService],
  exports: [HubsService],
})
export class HubsModule {}