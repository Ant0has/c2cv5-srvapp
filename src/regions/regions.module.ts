import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { PostMeta } from './post-meta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostMeta])],
  providers: [RegionsService],
  controllers: [RegionsController],
})
export class RegionsModule {}
