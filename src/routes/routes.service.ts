import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attraction } from 'src/attractions/attraction.entity';
import { Regions } from 'src/regions/regions.entity';
import { Routes } from 'src/routes/routes.entity';
import { Repository } from 'typeorm';
import { RouteReviewsService } from 'src/route-reviews/route-reviews.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Regions)
    private regionsRepository: Repository<Regions>,

    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,

    @InjectRepository(Attraction)
    private attractionsRepository: Repository<Attraction>,

    private routeReviewsService: RouteReviewsService, // Добавляем сервис отзывов
  ) { }

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
            },
          });

          const attractions = await this.attractionsRepository.find({
            where: {
              regionId: region?.ID,
            },
            order: {
              name: 'ASC',
            },
          });

          const reviewLimit = 10; // Ограничение на количество отзывов
          const reviewOffset = 0; // Смещение для пагинации

          // Получаем отзывы с указанными параметрами пагинации
          const reviews = await this.routeReviewsService.getReviewsByRouteUrl(
            url,
            reviewLimit,
            reviewOffset,
          );

          const totalReviews =
          await this.routeReviewsService.getReviewCountByRouteUrl(url);

          return {
            ...route,
            regions_data: region,
            routes:
              routes && routes?.length > 0
                ? routes.filter((route) => route?.url !== url)
                : [],
            attractions: attractions || [],
            reviews: {
              data: reviews || [],
              pagination: {
                total: totalReviews,
                limit: reviewLimit,
                offset: reviewOffset,
                hasMore: totalReviews > reviewOffset + reviewLimit,
              },
            },
            route_video_url:route.url === 'pskov-kpp_shumilkino' ? '/videos/pskov-kpp_shumilkino.mp4' : '',
            route_video_thumbnail:route.url === 'pskov-kpp_shumilkino' ? '/pskov-kpp_shumilkino-thumbnail.png' : '',
          };
        } else {
          throw new NotFoundException(
            `Регион с id=${route?.region_id} отсутствует`,
          );
        }
      } else {
        throw new NotFoundException('Данный маршрут отсутствует');
      }
    } catch (error) {
      throw new BadRequestException('Ошибка при выполнении операции');
    }
  }

  async getRouteDetailsWithReviews(
    url: string,
    reviewLimit: number = 10,
    reviewOffset: number = 0,
  ): Promise<any> {
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

          // Получаем отзывы с указанными параметрами пагинации
          const reviews = await this.routeReviewsService.getReviewsByRouteUrl(
            url,
            reviewLimit,
            reviewOffset,
          );

          const totalReviews =
            await this.routeReviewsService.getReviewCountByRouteUrl(url);

          return {
            ...route,
            regions_data: region,
            reviews: {
              data: reviews || [],
              pagination: {
                total: totalReviews,
                limit: reviewLimit,
                offset: reviewOffset,
                hasMore: totalReviews > reviewOffset + reviewLimit,
              },
            },
          };
        } else {
          throw new NotFoundException(
            `Регион с id=${route?.region_id} отсутствует`,
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
