import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/regions/posts.entity';
import { PostMeta } from 'src/regions/post-meta.entity';
import { Regions } from 'src/regions/regions.entity';
import { Routes } from 'src/regions/routes.entity';
import { RoutesAttractionsService } from './routes-attractions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostMeta, Regions, Routes])],
  providers: [RoutesService, RoutesAttractionsService],
  controllers: [RoutesController],
})
export class RoutesModule {}
