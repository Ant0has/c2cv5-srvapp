import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './create-hub.dto';
import { UpdateHubDto } from './update-hub.dto';

@ApiTags('Хабы')
@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать хаб' })
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubsService.create(createHubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Все хабы' })
  findAll() {
    return this.hubsService.findAll();
  }

  @Get('featured-destinations')
  @ApiOperation({ summary: 'Избранные направления из всех хабов' })
  getFeaturedDestinations() {
    return this.hubsService.getFeaturedDestinations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Хаб по ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.hubsService.findOne(+id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Хаб по slug' })
  @ApiParam({ name: 'slug', example: 'gornolyzhka' })
  findBySlug(@Param('slug') slug: string) {
    return this.hubsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить хаб' })
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubsService.update(+id, updateHubDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить хаб' })
  remove(@Param('id') id: string) {
    return this.hubsService.remove(+id);
  }
}
