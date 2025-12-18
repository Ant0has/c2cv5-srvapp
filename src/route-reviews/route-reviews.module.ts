
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteReview } from './route-review.entity';
import { RouteReviewsController } from './route-reviews.controller';
import { RouteReviewsService } from './route-reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([RouteReview])],
  controllers: [RouteReviewsController],
  providers: [RouteReviewsService],
  exports: [RouteReviewsService],
})
export class RouteReviewsModule {}