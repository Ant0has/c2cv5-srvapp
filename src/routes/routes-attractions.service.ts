import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';


const regionsData = [
    {
        "ID": 1,
        "region_code": "77"
    },
    {
        "ID": 2,
        "region_code": "78"
    },
    {
        "ID": 3,
        "region_code": "28"
    },
    {
        "ID": 4,
        "region_code": "29"
    },
    {
        "ID": 5,
        "region_code": "22"
    },
    {
        "ID": 6,
        "region_code": "30"
    },
    {
        "ID": 7,
        "region_code": "31"
    },
    {
        "ID": 8,
        "region_code": "32"
    },
    {
        "ID": 9,
        "region_code": "33"
    },
    {
        "ID": 10,
        "region_code": "34"
    },
    {
        "ID": 11,
        "region_code": "35"
    },
    {
        "ID": 12,
        "region_code": "36"
    },
    {
        "ID": 13,
        "region_code": "79"
    },
    {
        "ID": 14,
        "region_code": "75"
    },
    {
        "ID": 15,
        "region_code": "37"
    },
    {
        "ID": 16,
        "region_code": "38"
    },
    {
        "ID": 17,
        "region_code": "23"
    },
    {
        "ID": 18,
        "region_code": "24"
    },
    {
        "ID": 19,
        "region_code": "40"
    },
    {
        "ID": 20,
        "region_code": "42"
    },
    {
        "ID": 21,
        "region_code": "43"
    },
    {
        "ID": 22,
        "region_code": "44"
    },
    {
        "ID": 23,
        "region_code": "45"
    },
    {
        "ID": 24,
        "region_code": "46"
    },
    {
        "ID": 25,
        "region_code": "48"
    },
    {
        "ID": 26,
        "region_code": "51"
    },
    {
        "ID": 27,
        "region_code": "52"
    },
    {
        "ID": 28,
        "region_code": "53"
    },
    {
        "ID": 29,
        "region_code": "54"
    },
    {
        "ID": 30,
        "region_code": "58"
    },
    {
        "ID": 31,
        "region_code": "60"
    },
    {
        "ID": 32,
        "region_code": "59"
    },
    {
        "ID": 33,
        "region_code": "25"
    },
    {
        "ID": 34,
        "region_code": "55"
    },
    {
        "ID": 35,
        "region_code": "56"
    },
    {
        "ID": 36,
        "region_code": "57"
    },
    {
        "ID": 37,
        "region_code": "61"
    },
    {
        "ID": 38,
        "region_code": "62"
    },
    {
        "ID": 40,
        "region_code": "02"
    },
    {
        "ID": 41,
        "region_code": "03"
    },
    {
        "ID": 42,
        "region_code": "08"
    },
    {
        "ID": 43,
        "region_code": "10"
    },
    {
        "ID": 44,
        "region_code": "11"
    },
    {
        "ID": 45,
        "region_code": "82"
    },
    {
        "ID": 46,
        "region_code": "12"
    },
    {
        "ID": 47,
        "region_code": "13"
    },
    {
        "ID": 48,
        "region_code": "14"
    },
    {
        "ID": 49,
        "region_code": "16"
    },
    {
        "ID": 50,
        "region_code": "17"
    },
    {
        "ID": 51,
        "region_code": "65"
    },
    {
        "ID": 52,
        "region_code": "63"
    },
    {
        "ID": 53,
        "region_code": "64"
    },
    {
        "ID": 54,
        "region_code": "67"
    },
    {
        "ID": 55,
        "region_code": "66"
    },
    {
        "ID": 56,
        "region_code": "26"
    },
    {
        "ID": 57,
        "region_code": "68"
    },
    {
        "ID": 58,
        "region_code": "70"
    },
    {
        "ID": 59,
        "region_code": "69"
    },
    {
        "ID": 60,
        "region_code": "71"
    },
    {
        "ID": 61,
        "region_code": "72"
    },
    {
        "ID": 62,
        "region_code": "73"
    },
    {
        "ID": 63,
        "region_code": "18"
    },
    {
        "ID": 64,
        "region_code": "27"
    },
    {
        "ID": 65,
        "region_code": "86"
    },
    {
        "ID": 66,
        "region_code": "74"
    },
    {
        "ID": 67,
        "region_code": "21"
    },
    {
        "ID": 68,
        "region_code": "82"
    },
    {
        "ID": 69,
        "region_code": "76"
    }
  ]

@Injectable()
export class RoutesAttractionsService {
  private attractionsPath = path.join(
    process.cwd(),
    'src',
    'attractions',
    'data',
    'attractions.json'
  );

  /** Загружаем JSON с картинками */
  private loadAttractions() {
    const raw = fs.readFileSync(this.attractionsPath, 'utf8');
    return JSON.parse(raw);
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

  public findImagesForRoute(routeData: any) {
    const { url, title, region_id } = routeData;

    const attractions = this.loadAttractions();

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
