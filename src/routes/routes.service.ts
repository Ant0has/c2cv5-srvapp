import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attraction } from 'src/attractions/attraction.entity';
import { Regions } from 'src/regions/regions.entity';
import { Routes } from 'src/routes/routes.entity';
import { RouteReview } from 'src/route-reviews/route-review.entity';
import { Repository } from 'typeorm';
import { RouteReviewsService } from 'src/route-reviews/route-reviews.service';

export interface RouteDetailsResponse extends Routes {
  regions_data: Regions;
  routes: Pick<Routes, 'ID' | 'url' | 'title'>[];
  attractions: Attraction[];
  reviews: {
    data: RouteReview[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
  route_video_url: string;
  route_video_thumbnail: string;
}

export interface RouteReviewsResponse extends Routes {
  regions_data: Regions;
  reviews: {
    data: RouteReview[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

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

  async getRoutDetails(url: string): Promise<RouteDetailsResponse> {
    const route = await this.routesRepository.findOne({
      where: { url },
    });

    if (!route) {
      throw new NotFoundException('Данный маршрут отсутствует');
    }

    const region = await this.regionsRepository.findOne({
      where: { ID: route.region_id },
    });

    if (!region) {
      throw new NotFoundException(
        `Регион с id=${route.region_id} отсутствует`,
      );
    }

    const reviewLimit = 10;
    const reviewOffset = 0;

    // Параллельные запросы вместо последовательных
    const [routes, attractions, reviews, totalReviews] = await Promise.all([
      this.routesRepository.find({
        where: { region_id: region.ID, is_whitelist: 1 },
        select: ['ID', 'url', 'title'],
      }),
      this.attractionsRepository.find({
        where: { regionId: region.ID },
        order: { name: 'ASC' },
      }),
      this.routeReviewsService.getReviewsByRouteUrl(url, reviewLimit, reviewOffset),
      this.routeReviewsService.getReviewCountByRouteUrl(url),
    ]);

    return {
      ...route,
      regions_data: region,
      routes: routes.filter((r) => r.url !== url),
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
      route_video_url: route.url === 'pskov-kpp_shumilkino' ? '/videos/pskov-kpp_shumilkino.mp4' : '',
      route_video_thumbnail: route.url === 'pskov-kpp_shumilkino' ? '/pskov-kpp_shumilkino-thumbnail.png' : '',
    };
  }

  async getRouteDetailsWithReviews(
    url: string,
    reviewLimit: number = 10,
    reviewOffset: number = 0,
  ): Promise<RouteReviewsResponse> {
    const route = await this.routesRepository.findOne({
      where: { url },
    });

    if (!route) {
      throw new NotFoundException('Данный маршрут отсутствует');
    }

    const region = await this.regionsRepository.findOne({
      where: { ID: route.region_id },
    });

    if (!region) {
      throw new NotFoundException(
        `Регион с id=${route.region_id} отсутствует`,
      );
    }

    const [reviews, totalReviews] = await Promise.all([
      this.routeReviewsService.getReviewsByRouteUrl(url, reviewLimit, reviewOffset),
      this.routeReviewsService.getReviewCountByRouteUrl(url),
    ]);

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
  }
}
