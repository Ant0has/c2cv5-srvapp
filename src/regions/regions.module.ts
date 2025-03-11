import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { PostMeta } from './post-meta.entity';
import { Regions } from './regions.entity';
import { Routes } from './routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostMeta, Regions, Routes])],
  providers: [RegionsService],
  controllers: [RegionsController],
})
export class RegionsModule {}
