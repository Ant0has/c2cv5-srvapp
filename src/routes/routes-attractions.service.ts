import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AttractionImage } from 'src/attractions/attraction-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { regionsData } from 'src/data';

@Injectable()
export class RoutesAttractionsService {
    constructor(
        @InjectRepository(AttractionImage)
        private attractionImageRepository: Repository<AttractionImage>,
      ) {}
      


  /** Загружаем JSON с картинками */
  private async loadAttractions(): Promise<AttractionImage[]> {
    return this.attractionImageRepository.find();
  }

  /** Очистка строки: аэропорт-кызыл-тува → аэропорт, кызыл, тува */
  private splitWords(str: string): string[] {
    return str
      .toLowerCase()
      .replace(/[^a-zа-я0-9-]/g, '')
      .split('-')
      .filter(Boolean);
  }

  private getRegionCode(region_id: number) {
    const region = regionsData.find((region) => region.ID === region_id);
    return region?.region_code;
  }

  public async findImagesForRoute(routeData: any): Promise<any> {
    const { url, title, region_id } = routeData;

    const attractions = await this.loadAttractions();

    const urlWords = this.splitWords(url);

    const titleWords = this.splitWords(title);

    const citySeoWords = routeData.city_seo_data
      ? routeData.city_seo_data
          .toLowerCase()
          .split(',')
          .map((s: string) => s.trim())
      : [];

    const searchTerms = [
      ...urlWords,
      ...titleWords,
      ...citySeoWords,
    ].filter(el => el !== '' && el !== '-');

    const byName = attractions.filter((item) =>
      searchTerms.some((word) => item.name.includes(word))
    );

    const region_code = this.getRegionCode(region_id);

    const byRegion = attractions.filter(
      (item) =>
        item.region === String(region_code)
    );

    const images = [...byName, ...byRegion];

    return {
      name: title,
      region_id,
      region_code,
      url,
      description: "",
      images
    };
  }
}
