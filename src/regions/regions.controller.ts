import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UpdateRegionDataDTO } from './dto/update-region-data.dto';
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

  @Put('updateRegion/:id')
  async updateRegionDataById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostMetaDto: UpdateRegionDataDTO,
  ) {
    return this.regionsService.updateRegionDataById(id, updatePostMetaDto);
  }

  @Delete('deleteRegion/:id')
  async deleteRegionById(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.deleteRegionById(id);
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
