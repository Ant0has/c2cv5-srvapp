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

  // async createRegions(): Promise<any> {
  //   for (const region of mocRegions) {
  //     const newRegion = this.regionsRepository.create({
  //       meta_id: region?.meta_id,
  //       post_id: region?.post_id,
  //       meta_key: region?.meta_key,
  //       meta_value: region?.meta_value,
  //       region_value: region?.region_value,
  //       address: region?.address,
  //       url: region?.url,
  //       phone_number: region?.phone_number,
  //     });

  //     await this.regionsRepository.save(newRegion);
  //   }

  //   return 'regions successfully created';
  // }

  async getTrueRegions(): Promise<any> {
    return this.regionsRepository.find();
  }

  // async addRoutesByRegion(url: string): Promise<any> {
  //   const targetRegion = await this.regionsRepository.find({
  //     where: {
  //       url,
  //     },
  //   });
  //   if (targetRegion && targetRegion.length > 0) {
  //     const region = targetRegion[0];
  //     const regionsData = await this.postMetaRepository.find({
  //       where: {
  //         meta_key: 'FromRegion',
  //         meta_value: Like(`%${region?.meta_value}%`), //TODO - добавить условий для изменных названий
  //       },
  //     });

  //     if (regionsData && regionsData?.length > 0) {
  //       const postIdList = regionsData.map((el) => el?.post_id);

  //       const resultList = [];

  //       for (let k = 0; k < postIdList.length; k++) {
  //         const post_id = postIdList[k];

  //         const targetPosts = await this.postsRepository.find({
  //           where: {
  //             ID: post_id,
  //           },
  //         });

  //         const readyObject = {
  //           city_data: ['-', '-'],
  //           city_seo_data: ['-', '-'],
  //         } as any;

  //         if (targetPosts && targetPosts?.length > 0) {
  //           targetPosts.forEach((post) => {
  //             if (post?.post_title) {
  //               readyObject['title'] = post?.post_title;
  //             }
  //             if (post?.post_content) {
  //               readyObject['content'] = post?.post_content;
  //             }
  //             if (post?.ID) {
  //               readyObject['post_id'] = post?.ID;
  //             }
  //             if (post?.post_name) {
  //               readyObject['url'] = post?.post_name;
  //             }
  //             if (region?.ID) {
  //               readyObject['region_id'] = region?.ID;
  //             }
  //           });
  //         }

  //         const metaDataList = await this.postMetaRepository.find({
  //           where: {
  //             post_id: readyObject?.post_id,
  //           },
  //         });
  //         console.log('metaDataList', metaDataList);
  //         if (metaDataList && metaDataList.length > 0) {
  //           metaDataList.forEach((item) => {
  //             if (item.meta_key === '_yoast_wpseo_title') {
  //               readyObject['seo_title'] = item.meta_value ?? '';
  //             }
  //             if (item.meta_key === '_yoast_wpseo_metadesc') {
  //               readyObject['seo_description'] = item.meta_value ?? '';
  //             }

  //             if (item.meta_key === 'FromCitySeo') {
  //               readyObject['city_seo_data'][0] = item.meta_value ?? '-';
  //             }

  //             if (item.meta_key === 'ToCitySeo') {
  //               readyObject['city_seo_data'][1] = item.meta_value ?? '-';
  //             }

  //             if (item.meta_key === 'FromCity') {
  //               readyObject['city_data'][0] = item.meta_value ?? '-';
  //             }

  //             if (item.meta_key === 'ToCity') {
  //               readyObject['city_data'][1] = item.meta_value ?? '-';
  //             }

  //             if (item.meta_key === 'km') {
  //               readyObject['distance'] = item.meta_value ?? '';
  //             }
  //           });
  //         }

  //         readyObject['city_data'] = readyObject['city_data'].join(',');
  //         readyObject['city_seo_data'] = readyObject['city_seo_data'].join(',');

  //         resultList.push(readyObject);
  //       }
  //       console.log('resultList', resultList);
  //       for (const result of resultList) {
  //         if (result && Object.keys(result).length > 0) {
  //           const targetRoute = await this.routesRepository.find({
  //             where: {
  //               title: result?.title,
  //             },
  //           });
  //           if (!targetRoute || (targetRoute && targetRoute.length === 0)) {
  //             const res = this.routesRepository.create(result);
  //             await this.routesRepository.save(res);
  //           } else {
  //             console.log('такой маршрут уже добавлен ->', result);
  //           }
  //         } else {
  //           console.log('пустой маршрут', result);
  //         }
  //       }
  //     }
  //   } else {
  //     return 'не пришел url';
  //   }

  //   // return this.routesRepository.find();
  //   return 'операция успешно завершена';
  // }

  async addRoutesByRegion(url: string): Promise<any> {
    console.time('addRoutesByRegion');

    const targetRegion = await this.regionsRepository.find({
      where: { url },
    });

    console.log('targetRegion', targetRegion);

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

    // console.log('postIdList', postIdList);

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
        region_id: region?.ID ?? '',
      } as any;

      const postMeta = metaDataList.filter(
        (item) => Number(item.post_id) === post.ID,
      );
      console.log('postMeta', postMeta);
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

    console.timeEnd('addRoutesByRegion');
    return {
      message: 'Операция успешно завершена',
      routes: routesToInsert,
    };
  }

  async addRoutesForCrym(): Promise<any> {
    console.time('addRoutesByRegion');

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

    // console.log('postIdList', postIdList);

    // Получаем все посты и метаданные за один запрос
    const [targetPosts, metaDataList] = await Promise.all([
      this.postsRepository.find({ where: { ID: In(postIdList) } }),
      this.postMetaRepository.find({ where: { post_id: In(postIdList) } }),
    ]);

    console.log('targetPosts', targetPosts);
    // console.log('metaDataList', metaDataList);

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
      console.log('postMeta', postMeta);
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
      console.log('result', result);
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
