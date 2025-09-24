import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository } from 'typeorm';
import { PostMeta } from './post-meta.entity';
import { Posts } from './posts.entity';
import { Regions } from './regions.entity';
import { Routes } from './routes.entity';
import { UpdateRegionDataDTO } from './dto/update-region-data.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    @InjectRepository(PostMeta)
    private postMetaRepository: Repository<PostMeta>,

    @InjectRepository(Regions)
    private regionsRepository: Repository<Regions>,

    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
  ) {}

  async getRegions(): Promise<any> {
    return this.regionsRepository.find();
  }

  getPosts(): Promise<Posts[]> {
    return this.postsRepository.find({
      where: {
        ID: 41,
      },
    });
  }

  async getTrueRegions(): Promise<any> {
    return this.regionsRepository.find();
  }

  async addRoutesByRegion(url: string): Promise<any> {
    const targetRegion = await this.regionsRepository.find({
      where: { url },
    });

    if (!targetRegion?.length) {
      return 'Не пришел url';
    }

    const region = targetRegion[0];
    const regionsData = await this.postMetaRepository.find({
      where: {
        meta_key: 'FromRegion',
        meta_value: Like(`%${region?.meta_value}%`),
      },
    });

    if (!regionsData?.length) {
      return 'Нет данных для региона';
    }

    const postIdList = regionsData.map((el) => el?.post_id);

    // Получаем все посты и метаданные за один запрос
    const [targetPosts, metaDataList] = await Promise.all([
      this.postsRepository.find({ where: { ID: In(postIdList) } }),
      this.postMetaRepository.find({ where: { post_id: In(postIdList) } }),
    ]);

    const resultList = targetPosts.map((post) => {
      const readyObject = {
        city_data: ['-', '-'],
        city_seo_data: ['-', '-'],
        title: post?.post_title ?? '',
        content: post?.post_content ?? '',
        post_id: post?.ID ?? '',
        url: post?.post_name ?? '',
        region_id: region?.ID ?? '',
      } as any;

      const postMeta = metaDataList.filter(
        (item) => Number(item.post_id) === post.ID,
      );
      postMeta.forEach((item) => {
        switch (item.meta_key) {
          case '_yoast_wpseo_title':
            readyObject['seo_title'] = item.meta_value ?? '';
            break;
          case '_yoast_wpseo_metadesc':
            readyObject['seo_description'] = item.meta_value ?? '';
            break;
          case 'FromCitySeo':
            readyObject['city_seo_data'][0] = item.meta_value ?? '-';
            break;
          case 'ToCitySeo':
            readyObject['city_seo_data'][1] = item.meta_value ?? '-';
            break;
          case 'FromCity':
            readyObject['city_data'][0] = item.meta_value ?? '-';
            break;
          case 'ToCity':
            readyObject['city_data'][1] = item.meta_value ?? '-';
            break;
          case 'km':
            readyObject['distance'] = item.meta_value ?? '';
            break;
        }
      });

      readyObject['city_data'] = readyObject['city_data'].join(',');
      readyObject['city_seo_data'] = readyObject['city_seo_data'].join(',');

      return readyObject;
    });

    const routesToInsert = [];

    for (const result of resultList) {
      const targetRoute = await this.routesRepository.find({
        where: { title: result?.title },
      });
      if (!targetRoute?.length) {
        routesToInsert.push(result);
      }
    }

    if (routesToInsert.length > 0) {
      await this.routesRepository.insert(routesToInsert as any);
    }

    // console.timeEnd('addRoutesByRegion');
    return {
      message: 'Операция успешно завершена',
      routes: routesToInsert,
    };
  }

  async addRoutesForCrym(): Promise<any> {
    // console.time('addRoutesByRegion');

    const regionsData = await this.postMetaRepository.find({
      where: {
        meta_key: 'FromRegion',
        meta_value: Like(`%Новые территории%`),
      },
    });

    if (!regionsData?.length) {
      return 'Нет данных для региона';
    }

    const postIdList = regionsData.map((el) => el?.post_id);

    console.log('postIdList', postIdList);
    // console.log('regionsData', regionsData);

    // Получаем все посты и метаданные за один запрос
    const [targetPosts, metaDataList] = await Promise.all([
      this.postsRepository.find({ where: { ID: In(postIdList) } }),
      this.postMetaRepository.find({ where: { post_id: In(postIdList) } }),
    ]);

    console.log('targetPosts', targetPosts);
    console.log('metaDataList', metaDataList);

    const resultList = targetPosts.map((post) => {
      const readyObject = {
        city_data: ['-', '-'],
        city_seo_data: ['-', '-'],
        title: post?.post_title ?? '',
        content: post?.post_content ?? '',
        post_id: post?.ID ?? '',
        url: post?.post_name ?? '',
        region_id: 45,
      } as any;

      const postMeta = metaDataList.filter(
        (item) => Number(item.post_id) === post.ID,
      );
      // console.log('postMeta', postMeta);
      postMeta.forEach((item) => {
        switch (item.meta_key) {
          case '_yoast_wpseo_title':
            readyObject['seo_title'] = item.meta_value ?? '';
            break;
          case '_yoast_wpseo_metadesc':
            readyObject['seo_description'] = item.meta_value ?? '';
            break;
          case 'FromCitySeo':
            readyObject['city_seo_data'][0] = item.meta_value ?? '-';
            break;
          case 'ToCitySeo':
            readyObject['city_seo_data'][1] = item.meta_value ?? '-';
            break;
          case 'FromCity':
            readyObject['city_data'][0] = item.meta_value ?? '-';
            break;
          case 'ToCity':
            readyObject['city_data'][1] = item.meta_value ?? '-';
            break;
          case 'km':
            readyObject['distance'] = item.meta_value ?? '';
            break;
        }
      });

      readyObject['city_data'] = readyObject['city_data'].join(',');
      readyObject['city_seo_data'] = readyObject['city_seo_data'].join(',');

      return readyObject;
    });

    // Пакетное добавление в таблицу routes
    const routesToInsert = [];

    console.log('resultList', resultList);

    for (const result of resultList) {
      const targetRoute = await this.routesRepository.find({
        where: { title: result?.title },
      });
      // console.log(targetRoute,'--targetRoute')
      if (!targetRoute?.length) {
        routesToInsert.push(result);
      }
    }

    console.log(routesToInsert,'--routesToInsert')

    if (routesToInsert.length > 0) {
      await this.routesRepository.insert(routesToInsert as any);
    }

    console.timeEnd('addRoutesByRegion');
    return {
      message: 'Операция успешно завершена',
      routes: routesToInsert,
    };
  }

  async getRoutes(): Promise<any> {
    return this.routesRepository.find();
  }

  async getRoutesByRegion(id: number): Promise<any> {
    return this.routesRepository.find({
      where: {
        region_id: id,
      },
    });
  }

  async processRegions(): Promise<void> {
    const regionsData = await this.regionsRepository.find();
    for (const region of regionsData) {
      if (region.url) {
        try {
          const result = await this.addRoutesByRegion(region.url);
          console.log(`Результат для региона ${region.meta_value}:`, result);
        } catch (error) {
          console.error(
            `Ошибка при обработке региона ${region.meta_value}:`,
            error,
          );
        }
      } else {
        console.warn(`У региона ${region.meta_value} отсутствует URL.`);
      }
    }
  }
  async updateRegionDataById(
    regionId: number,
    updateData: UpdateRegionDataDTO,
  ): Promise<Regions> {
    const [targetRegion] = await this.regionsRepository.find({
      where: { ID: regionId },
    });

    if (!targetRegion) {
      throw new Error('Запись не найдена');
    }

    // Обновляем только переданные поля
    Object.assign(targetRegion, updateData);

    return await this.regionsRepository.save(targetRegion);
  }

  async deleteRegionById(regionId: number): Promise<DeleteResult> {
    return await this.regionsRepository.delete(regionId);
  }
}
