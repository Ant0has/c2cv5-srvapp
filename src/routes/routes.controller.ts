import { Controller, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('/:url')
  async getRoutDetails(@Param('url') url: string): Promise<any> {
    return this.routesService.getRoutDetails(url); // Передаем параметр url в сервис
  }
}
