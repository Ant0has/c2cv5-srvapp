
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './create-hub.dto';
import { UpdateHubDto } from './update-hub.dto';

@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubsService.create(createHubDto);
  }

  @Get()
  findAll() {
    return this.hubsService.findAll();
  }

  @Get('featured-destinations')
  getFeaturedDestinations() {
    return this.hubsService.getFeaturedDestinations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hubsService.findOne(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.hubsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubsService.update(+id, updateHubDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.hubsService.remove(+id);
  }
}