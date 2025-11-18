import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/regions/posts.entity';
import { PostMeta } from 'src/regions/post-meta.entity';
import { Regions } from 'src/regions/regions.entity';
import { Routes } from 'src/routes/routes.entity';
import { RoutesAttractionsService } from './routes-attractions.service';
import { AttractionImage } from 'src/attractions/attraction-image.entity';
import { Attraction } from 'src/attractions/attraction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostMeta, Regions, Routes, AttractionImage, Attraction])],
  providers: [RoutesService, RoutesAttractionsService],
  controllers: [RoutesController],
})
export class RoutesModule {}
