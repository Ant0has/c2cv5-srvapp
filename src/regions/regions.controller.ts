import { Controller, Get } from '@nestjs/common';
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
}
