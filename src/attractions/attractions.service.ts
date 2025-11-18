import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AttractionImage } from './attraction-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from './attraction.entity';
import { regionsData } from 'src/data';
import { RegionData } from 'src/types';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

interface AttractionImageRaw {
  id: number;
  region: string;
  name: string;
  size: string;
  path: string;
}

@Injectable()
export class AttractionsService {
  constructor(
    @InjectRepository(AttractionImage)
    private attractionImageRepository: Repository<AttractionImage>,
    @InjectRepository(Attraction)
    private attractionsRepository: Repository<Attraction>,
  ) { }

  private imagesDir = '/var/www/images/city2city/attractions/';
  private jsonPath = path.join(
    process.cwd(),
    'src',
    'attractions',
    'data',
    'attractions.json',
  );

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

  async getImagesList(): Promise<AttractionImage[]> {
    return this.attractionImageRepository.find();
  }

  async transformAndSaveAttractionsData(): Promise<Attraction[]> {
    const images = await this.attractionImageRepository.find();

    const groupedData = this.groupImages(images, regionsData);

    await this.attractionsRepository.clear();

    const attractionsToSave = groupedData.map(item => {
      const attraction = new Attraction();
      attraction.regionId = item.regionId;
      attraction.regionCode = item.regionCode;
      attraction.imageDesktop = item.imageDesktop;
      attraction.imageMobile = item.imageMobile;
      attraction.name = item.name;
      attraction.description = '';
      return attraction;
    });

    return await this.attractionsRepository.save(attractionsToSave);
  }

  private groupImages(images: AttractionImageRaw[], regionsData: RegionData[]): any[] {
    const grouped: { [key: string]: any } = {};

    images.forEach(image => {
      const key = `${image.region}-${image.name}`;

      if (!grouped[key]) {
        const regionInfo = regionsData.find(r => r.region_code === image.region);

        grouped[key] = {
          regionId: regionInfo?.ID || 0,
          regionCode: image.region,
          name: image.name,
          imageDesktop: '',
          imageMobile: ''
        };
      }

      if (image.size === 'desktop') {
        grouped[key].imageDesktop = image.path;
      } else if (image.size === 'mobile') {
        grouped[key].imageMobile = image.path;
      }
    });

    return Object.values(grouped).filter(item =>
      item.imageDesktop && item.imageMobile
    );
  }

  async getTransformedData(): Promise<Attraction[]> {
    return await this.attractionsRepository.find();
  }

  async findOneAttraction(id: number): Promise<Attraction> {
    const attraction = await this.attractionsRepository.findOne({ where: { id } });
    if (!attraction) {
      throw new NotFoundException(`Attraction with ID ${id} not found`);
    }
    return attraction;
  }

  async findAttractionsByRegion(regionCode: string): Promise<Attraction[]> {
    return await this.attractionsRepository.find({
      where: { regionCode },
      order: { name: 'ASC' }
    });
  }

  async updateAttraction(id: number, updateData: UpdateAttractionDto): Promise<Attraction> {
    const attraction = await this.findOneAttraction(id);

    if (updateData.regionId !== undefined) {
      attraction.regionId = updateData.regionId;
    }
    if (updateData.regionCode !== undefined) {
      attraction.regionCode = updateData.regionCode;
    }
    if (updateData.imageDesktop !== undefined) {
      attraction.imageDesktop = updateData.imageDesktop;
    }
    if (updateData.imageMobile !== undefined) {
      attraction.imageMobile = updateData.imageMobile;
    }
    if (updateData.name !== undefined) {
      attraction.name = updateData.name;
    }
    if (updateData.description !== undefined) {
      attraction.description = updateData.description;
    }

    return await this.attractionsRepository.save(attraction);
  }

    async createAttraction(createData: {
      regionId: number;
      regionCode: string;
      imageDesktop: string;
      imageMobile: string;
      name: string;
      description?: string;
    }): Promise<Attraction> {
      const attraction = this.attractionsRepository.create({
        ...createData,
        description: createData.description || ''
      });
      
      return await this.attractionsRepository.save(attraction);
    }

  async removeAttraction(id: number): Promise<void> {
    const result = await this.attractionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attraction with ID ${id} not found`);
    }
  }
}
