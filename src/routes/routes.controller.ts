import { Controller, Get, Param, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesAttractionsService } from './routes-attractions.service';
import { RouteUrlParam, ReviewsQueryDto } from './dto/route-params.dto';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly routesAttractionsService: RoutesAttractionsService) { }

  @Get('/:url')
  async getRoutDetails(@Param() params: RouteUrlParam): Promise<any> {
    return this.routesService.getRoutDetails(params.url);
  }

  @Get('getRouteWithImages/:url')
  async getRouteWithImages(@Param() params: RouteUrlParam): Promise<any> {
    const data = await this.routesService.getRoutDetails(params.url);
    return this.routesAttractionsService.findImagesForRoute(data);
  }

  @Get('/:url/reviews')
  async getRouteReviews(
    @Param() params: RouteUrlParam,
    @Query() query: ReviewsQueryDto,
  ): Promise<any> {
    const limit = Math.min(Number(query.limit) || 10, 100);
    const offset = Number(query.offset) || 0;
    const data = await this.routesService.getRouteDetailsWithReviews(
      params.url,
      limit,
      offset,
    );
    return data.reviews;
  }
}
