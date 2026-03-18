import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateRegionDataDTO } from './dto/update-region-data.dto';
import { RegionsService } from './regions.service';

@ApiTags('Регионы')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: 'Все регионы' })
  async findAll(): Promise<any> {
    return this.regionsService.getRegions();
  }

  @Get('/getPosts')
  @ApiOperation({ summary: 'Получить посты (WordPress)' })
  async getPosts(): Promise<any> {
    return this.regionsService.getPosts();
  }

  @Put('updateRegion/:id')
  @ApiOperation({ summary: 'Обновить регион' })
  @ApiParam({ name: 'id', example: 1 })
  async updateRegionDataById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostMetaDto: UpdateRegionDataDTO,
  ) {
    return this.regionsService.updateRegionDataById(id, updatePostMetaDto);
  }

  @Delete('deleteRegion/:id')
  @ApiOperation({ summary: 'Удалить регион' })
  async deleteRegionById(@Param('id') id: number) {
    return this.regionsService.deleteRegionById(id);
  }

  @Get('/addRoutesByRegion/:url')
  @ApiOperation({ summary: 'Добавить маршруты по региону' })
  async addRoutesByRegion(@Param('url') url: string): Promise<any> {
    return this.regionsService.addRoutesByRegion(url);
  }

  @Get('/addRoutesForCrym')
  @ApiOperation({ summary: 'Добавить маршруты для Крыма' })
  async addRoutesForCrym(): Promise<any> {
    return this.regionsService.addRoutesForCrym();
  }

  @Get('/getRoutesByRegion/:id')
  @ApiOperation({ summary: 'Маршруты региона' })
  @ApiParam({ name: 'id', example: 1 })
  async getRoutesByRegion(@Param('id') id: string): Promise<any> {
    return this.regionsService.getRoutesByRegion(+id);
  }

  @Get('/processRegions')
  @ApiOperation({ summary: 'Обработать все регионы' })
  async processRegions(): Promise<any> {
    return this.regionsService.processRegions();
  }
}
