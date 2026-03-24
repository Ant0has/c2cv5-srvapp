import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { RoutesAttractionsService } from './routes-attractions.service';
import { RouteUrlParam, ReviewsQueryDto } from './dto/route-params.dto';

@ApiTags('Маршруты')
@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly routesAttractionsService: RoutesAttractionsService) { }

  @Get('by-region/:regionId')
  @ApiOperation({ summary: 'Маршруты региона для хаба', description: 'Возвращает whitelist-маршруты с ценами и расстояниями для хаб-страницы города' })
  @ApiParam({ name: 'regionId', example: 52 })
  async getRoutesByRegionForHub(
    @Param('regionId', ParseIntPipe) regionId: number,
  ) {
    return this.routesService.getRoutesByRegionForHub(regionId);
  }

  @Get('/:url')
  @ApiOperation({ summary: 'Детали маршрута', description: 'Возвращает маршрут с регионом, отзывами, достопримечательностями и другими маршрутами региона' })
  @ApiParam({ name: 'url', example: 'moskva-kazan' })
  async getRoutDetails(@Param() params: RouteUrlParam) {
    return this.routesService.getRoutDetails(params.url);
  }

  @Get('getRouteWithImages/:url')
  @ApiOperation({ summary: 'Маршрут с изображениями достопримечательностей' })
  @ApiParam({ name: 'url', example: 'moskva-kazan' })
  async getRouteWithImages(@Param() params: RouteUrlParam) {
    const data = await this.routesService.getRoutDetails(params.url);
    return this.routesAttractionsService.findImagesForRoute(data);
  }

  @Get('/:url/reviews')
  @ApiOperation({ summary: 'Отзывы маршрута с пагинацией' })
  @ApiParam({ name: 'url', example: 'moskva-kazan' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  async getRouteReviews(
    @Param() params: RouteUrlParam,
    @Query() query: ReviewsQueryDto,
  ) {
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
