import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateRegionDataDTO } from './dto/update-region-data.dto';
import { RegionsService } from './regions.service';
import { Regions } from './regions.entity';
import { Routes } from '../routes/routes.entity';
import { Posts } from './posts.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Регионы')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: 'Все регионы' })
  async findAll(): Promise<Regions[]> {
    return this.regionsService.getRegions();
  }

  @Get('/getPosts')
  @ApiOperation({ summary: 'Получить посты (WordPress)' })
  async getPosts(): Promise<Posts[]> {
    return this.regionsService.getPosts();
  }

  @Put('updateRegion/:id')
  @ApiOperation({ summary: 'Обновить регион' })
  @ApiParam({ name: 'id', example: 1 })
  async updateRegionDataById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostMetaDto: UpdateRegionDataDTO,
  ): Promise<Regions> {
    return this.regionsService.updateRegionDataById(id, updatePostMetaDto);
  }

  @Delete('deleteRegion/:id')
  @ApiOperation({ summary: 'Удалить регион' })
  async deleteRegionById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.regionsService.deleteRegionById(id);
  }

  @Get('/addRoutesByRegion/:url')
  @ApiOperation({ summary: 'Добавить маршруты по региону' })
  async addRoutesByRegion(@Param('url') url: string): Promise<string | { message: string; routes: Record<string, unknown>[] }> {
    return this.regionsService.addRoutesByRegion(url);
  }

  @Get('/addRoutesForCrym')
  @ApiOperation({ summary: 'Добавить маршруты для Крыма' })
  async addRoutesForCrym(): Promise<string | { message: string; routes: Record<string, unknown>[] }> {
    return this.regionsService.addRoutesForCrym();
  }

  @Get('/getRoutesByRegion/:id')
  @ApiOperation({ summary: 'Маршруты региона' })
  @ApiParam({ name: 'id', example: 1 })
  async getRoutesByRegion(@Param('id', ParseIntPipe) id: number): Promise<Routes[]> {
    return this.regionsService.getRoutesByRegion(id);
  }

  @Get('/processRegions')
  @ApiOperation({ summary: 'Обработать все регионы' })
  async processRegions(): Promise<void> {
    return this.regionsService.processRegions();
  }
}
