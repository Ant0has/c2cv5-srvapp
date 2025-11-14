import { Controller, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesAttractionsService } from './routes-attractions.service';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService, 
    private readonly routesAttractionsService: RoutesAttractionsService) { }

  @Get('/:url')
  async getRoutDetails(@Param('url') url: string): Promise<any> {
    return this.routesService.getRoutDetails(url); // Передаем параметр url в сервис
  }

  @Get('getRouteWithImages/:url')
  async getRouteWithImages(@Param('url') url: string): Promise<any> {
    const data = await this.routesService.getRoutDetails(url);

    return this.routesAttractionsService.findImagesForRoute(data);
  }
}
