import { Controller, Get, Param, Query } from '@nestjs/common';
import { RouteReviewsService } from './route-reviews.service';

@Controller('route-reviews')
export class RouteReviewsController {
  constructor(private readonly routeReviewsService: RouteReviewsService) {}

  @Get('route/:url')
  async getReviewsByRouteUrl(
    @Param('url') url: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.routeReviewsService.getReviewsByRouteUrl(url, limit, offset);
  }

  @Get('route/:url/stats')
  async getReviewStats(@Param('url') url: string) {
    return this.routeReviewsService.getReviewStatsByRouteUrl(url);
  }

  @Get('latest')
  async getLatestReviews(@Query('limit') limit?: number) {
    return this.routeReviewsService.getLatestReviews(limit);
  }

  @Get('route/:url/count')
  async getReviewCount(@Param('url') url: string) {
    const count = await this.routeReviewsService.getReviewCountByRouteUrl(url);
    return { count };
  }
}