import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './create-destination.dto';
import { UpdateDestinationDto } from './update-destination.dto';

@ApiTags('Направления')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать направление' })
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Все направления (с фильтром по хабу)' })
  @ApiQuery({ name: 'hub', required: false, example: 'gornolyzhka' })
  findAll(@Query('hub') hub?: string) {
    return this.destinationsService.findAll(hub);
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск направлений' })
  @ApiQuery({ name: 'q', example: 'Сочи' })
  search(@Query('q') query: string) {
    if (!query || typeof query !== 'string') {
      return [];
    }
    return this.destinationsService.search(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Избранные направления' })
  getFeatured() {
    return this.destinationsService.getFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Направление по ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(+id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Направление по slug' })
  @ApiParam({ name: 'slug', example: 'krasnaya-polyana' })
  findBySlug(@Param('slug') slug: string) {
    return this.destinationsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить направление' })
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationsService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить направление' })
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(+id);
  }
}
