import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostMeta } from 'src/regions/post-meta.entity';
import { Posts } from 'src/regions/posts.entity';
import { Regions } from 'src/regions/regions.entity';
import { Routes } from 'src/regions/routes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoutesService {
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

  async getRoutDetails(url: string): Promise<any> {
    try {
      const targetRoutes = await this.routesRepository.find({
        where: {
          url,
        },
      });
      if (targetRoutes && targetRoutes.length > 0) {
        const route = targetRoutes[0];

        const regions = await this.regionsRepository.find({
          where: {
            ID: route?.region_id,
          },
        });

        if (regions && regions?.length > 0) {
          const region = regions[0];

          const routes = await this.routesRepository.find({
            where: {
              region_id: region?.ID,
              //   url: Not(url),
            },
          });

          // const distanceList = await this.postMetaRepository.find({
          //   where: {
          //     post_id: route?.post_id,
          //     meta_key: 'km',
          //   },
          // });

          return {
            ...route,
            // distance: distanceList[0]?.meta_value ?? 0,
            regions_data: region,
            routes:
              routes && routes?.length > 0
                ? routes.filter((route) => route?.url !== url)
                : [],
          };
        } else {
          throw new NotFoundException(
            `Регион с id=${route?.region_id}  отсутствует`,
          );
        }
      } else {
        throw new NotFoundException('Данный маршрут отсутствует');
      }
    } catch (error) {
      throw new BadRequestException('Ошибка при выполнении операции');
    }
  }
}
