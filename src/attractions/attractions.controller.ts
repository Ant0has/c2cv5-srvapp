import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Attraction } from './attraction.entity';
import { AttractionsService } from './attractions.service';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

@ApiTags('Достопримечательности')
@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) { }

  @Post()
  @ApiOperation({ summary: 'Создать достопримечательность' })
  async create(@Body() createData: {
    regionId: number;
    regionCode: string;
    imageDesktop: string;
    imageMobile: string;
    name: string;
    description?: string;
  }): Promise<Attraction> {
    return await this.attractionsService.createAttraction(createData);
  }

  @Get()
  @ApiOperation({ summary: 'Все достопримечательности' })
  async getAttractions(): Promise<Attraction[]> {
    return await this.attractionsService.getTransformedData();
  }

  @Get('region/:regionId')
  @ApiOperation({ summary: 'Достопримечательности региона' })
  @ApiParam({ name: 'regionId', example: 1 })
  async getByRegion(@Param('regionId') regionId: number): Promise<Attraction[]> {
    return await this.attractionsService.findAttractionsByRegionId(regionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Достопримечательность по ID' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Attraction> {
    return await this.attractionsService.findOneAttraction(id);
  }

  @Get('refresh-table')
  @ApiOperation({ summary: 'Обновить таблицу из файлов' })
  async refreshTable() {
    return this.attractionsService.generateTableData();
  }

  @Get('get-images')
  @ApiOperation({ summary: 'Список изображений' })
  async getImagesList() {
    return this.attractionsService.getImagesList();
  }

  @Post('transform')
  @ApiOperation({ summary: 'Трансформировать и сохранить данные' })
  async transformData(): Promise<{ message: string; data: Attraction[] }> {
    const data = await this.attractionsService.transformAndSaveAttractionsData();
    return {
      message: `Successfully transformed ${data.length} attractions`,
      data
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить достопримечательность' })
  async updateAttraction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateAttractionDto,
  ): Promise<Attraction> {
    return await this.attractionsService.updateAttraction(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить достопримечательность' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.attractionsService.removeAttraction(id);
    return { message: `Attraction with ID ${id} deleted successfully` };
  }

  @Get('gpt-generate/:attractionId')
  @ApiOperation({ summary: 'Сгенерировать описание через Yandex GPT' })
  async gptGenerate(@Param('attractionId', ParseIntPipe) attractionId: number): Promise<Attraction & { message: string }> {
    return await this.attractionsService.gptGenerate(attractionId);
  }
}
