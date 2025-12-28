import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './create-destination.dto';
import { UpdateDestinationDto } from './update-destination.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Get()
  findAll(@Query('hub') hub?: string) {
    return this.destinationsService.findAll(hub);
  }

  @Get('search')
  search(@Query('q') query: string) {
    if (!query || typeof query !== 'string') {
      return [];
    }
    return this.destinationsService.search(query);
  }

  @Get('featured')
  getFeatured() {
    return this.destinationsService.getFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.destinationsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationsService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(+id);
  }
}