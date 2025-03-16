import { Controller, Get, Param } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async findAll(): Promise<any> {
    const data = this.regionsService.getRegions();
    return data;
  }
  @Get('/getPosts')
  async getPosts(): Promise<any> {
    return this.regionsService.getPosts();
  }

  @Get('/addRoutesByRegion/:url') // :url указывает на параметр маршрута
  async addRoutesByRegion(@Param('url') url: string): Promise<any> {
    return this.regionsService.addRoutesByRegion(url); // Передаем параметр url в сервис
  }

  // @Get('/getRoutes') // :url указывает на параметр маршрута
  // async getRoutes(): Promise<any> {
  //   return this.regionsService.getRoutes(); // Передаем параметр url в сервис
  // }
  @Get('/getRoutesByRegion/:id') // :url указывает на параметр маршрута
  async getRoutesByRegion(@Param('id') id: string): Promise<any> {
    return this.regionsService.getRoutesByRegion(+id); // Передаем параметр url в сервис
  }

  @Get('/processRegions') // :url указывает на параметр маршрута
  async processRegions(): Promise<any> {
    return this.regionsService.processRegions(); // Передаем параметр url в сервис
  }
}
