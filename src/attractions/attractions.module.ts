import { Module } from '@nestjs/common';
import { AttractionsController } from './attractions.controller';
import { AttractionsService } from './attractions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractionImage } from './attraction-image.entity';
import { Attraction } from './attraction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttractionImage, Attraction])],
  controllers: [AttractionsController],
  providers: [AttractionsService],
})
export class AttractionsModule {}