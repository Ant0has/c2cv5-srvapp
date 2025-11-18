import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attraction.entity';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) { }

  @Post()
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
  async getAttractions(): Promise<Attraction[]> {
    return await this.attractionsService.getTransformedData();
  }

  @Get('refresh-table')
  async refreshTable() {
    return this.attractionsService.generateTableData();
  }

  @Get('get-images')
  async getImagesList() {
    return this.attractionsService.getImagesList();
  }

  @Post('transform')
  async transformData(): Promise<{ message: string; data: Attraction[] }> {
    const data = await this.attractionsService.transformAndSaveAttractionsData();
    return {
      message: `Successfully transformed ${data.length} attractions`,
      data
    };
  }

  @Put(':id')
  async updateAttraction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateAttractionDto,
  ): Promise<Attraction> {
    return await this.attractionsService.updateAttraction(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.attractionsService.removeAttraction(id);
    return { message: `Attraction with ID ${id} deleted successfully` };
  }
}
