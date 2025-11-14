import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AttractionImage } from './attraction-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AttractionsService {
  constructor(
    @InjectRepository(AttractionImage)
    private attractionImageRepository: Repository<AttractionImage>,
  ) {}
  
  private imagesDir = '/var/www/images/city2city/attractions/';
  private jsonPath = path.join(
    process.cwd(),
    'src',
    'attractions',
    'data',
    'attractions.json',
  );

  // getList() {
  //   if (!fs.existsSync(this.jsonPath)) {
  //     return this.generateJson();
  //   }

  //   const raw = fs.readFileSync(this.jsonPath, 'utf8');
  //   return JSON.parse(raw);
  // }

  async generateTableData(): Promise<AttractionImage[]> {
    const files = fs.readdirSync(this.imagesDir);

    const result = files
      .filter((f) => f.endsWith('.jpg'))
      .map((f) => {
        const parts = f.replace('.jpg', '').split('-');

        const region = parts[0];
        const size = parts[parts.length - 1];
        const name = parts.slice(1, -1).join('-');

        return {
          region,
          name,
          size,
          path: `/attractions/${f}`,
        };
      });

    // ---------- 1. Сохраняем JSON ----------
    fs.writeFileSync(this.jsonPath, JSON.stringify(result, null, 2));

    // ---------- 2. Сохраняем в базу ----------

    // Удаляем старые записи (чтобы не плодились)
    await this.attractionImageRepository.clear();

    // Вставляем пачками
    for (let i = 0; i < result.length; i += result.length) {
      await this.attractionImageRepository.insert(result.slice(i, i + result.length));
    }

    return await this.attractionImageRepository.find();
  }
}
