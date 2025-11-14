import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttractionsService {
  private imagesDir = '/var/www/images/city2city/attractions/';
  private jsonPath = path.join(
    process.cwd(),
    'src',
    'attractions',
    'data',
    'attractions.json',
  );

  /** Возвращает список */
  getList() {
    if (!fs.existsSync(this.jsonPath)) {
      return this.generateJson();
    }

    const raw = fs.readFileSync(this.jsonPath, 'utf8');
    return JSON.parse(raw);
  }

  /** Генерация JSON */
  generateJson() {
    const files = fs.readdirSync(this.imagesDir);

    const result = files
      .filter((f) => f.endsWith('.jpg'))
      .map((f) => {
        const parts = f.replace('.jpg', '').split('-');

        const region = parts[0];
        const size = parts[parts.length - 1]; // mobile/desktop
        const name = parts.slice(1, -1).join('-'); // всё между region и size

        return {
          region,
          name,
          size,
          path: path.join(this.imagesDir, f),
        };
      });

    fs.writeFileSync(this.jsonPath, JSON.stringify(result, null, 2));

    return result;
  }
}
