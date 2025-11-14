import { Controller, Get } from '@nestjs/common';
import { AttractionsService } from './attractions.service';

@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

//   @Get('get-list')
//   async getList() {
//     return this.attractionsService.getList();
//   }

  @Get('refresh-table')
  async refreshTable() {
    return this.attractionsService.generateTableData();
  }
}
