import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RouteReviewsService } from './route-reviews.service';

@ApiTags('Отзывы')
@Controller('route-reviews')
export class RouteReviewsController {
  constructor(private readonly routeReviewsService: RouteReviewsService) {}

  @Get('route/:url')
  @ApiOperation({ summary: 'Отзывы по URL маршрута' })
  @ApiParam({ name: 'url', example: 'moskva-tver' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getReviewsByRouteUrl(
    @Param('url') url: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.routeReviewsService.getReviewsByRouteUrl(url, limit, offset);
  }

  @Get('route/:url/stats')
  @ApiOperation({ summary: 'Статистика отзывов маршрута (средний рейтинг, распределение)' })
  @ApiParam({ name: 'url', example: 'moskva-tver' })
  async getReviewStats(@Param('url') url: string) {
    return this.routeReviewsService.getReviewStatsByRouteUrl(url);
  }

  @Get('by-cities')
  @ApiOperation({ summary: 'Отзывы по названиям городов' })
  @ApiQuery({ name: 'from', example: 'Москва' })
  @ApiQuery({ name: 'to', example: 'Тверь' })
  @ApiQuery({ name: 'limit', required: false })
  async getReviewsByCities(
    @Query('from') fromCity: string,
    @Query('to') toCity: string,
    @Query('limit') limit?: number,
  ) {
    return this.routeReviewsService.getReviewsByCities(fromCity, toCity, limit);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Последние отзывы' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getLatestReviews(@Query('limit') limit?: number) {
    return this.routeReviewsService.getLatestReviews(limit);
  }

  @Get('route/:url/count')
  @ApiOperation({ summary: 'Количество отзывов маршрута' })
  @ApiParam({ name: 'url', example: 'moskva-tver' })
  async getReviewCount(@Param('url') url: string) {
    const count = await this.routeReviewsService.getReviewCountByRouteUrl(url);
    return { count };
  }
}
