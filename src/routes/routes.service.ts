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
  routesToCity: Pick<Routes, 'ID' | 'url' | 'title'>[];
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
    const [routes, routesToCity, attractions, reviews, totalReviews] = await Promise.all([
      this.routesRepository.find({
        where: { region_id: region.ID, is_whitelist: 1 },
        select: ['ID', 'url', 'title'],
      }),
      this.findRoutesToSameCity(url, route.city_seo_data),
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
      routesToCity,
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

  async getRoutesByRegionForHub(regionId: number) {
    const routes = await this.routesRepository.find({
      where: { region_id: regionId, is_whitelist: 1 },
      select: ['ID', 'url', 'title', 'price_economy', 'distance_km'],
    });

    const prices = routes
      .map((r) => r.price_economy)
      .filter((p): p is number => p !== null && p > 0);

    return {
      routes,
      totalCount: routes.length,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    };
  }

  private async findRoutesToSameCity(
    currentUrl: string,
    citySeoData: string | null,
  ): Promise<Pick<Routes, 'ID' | 'url' | 'title'>[]> {
    if (!citySeoData) return [];

    const parts = citySeoData.split(',');
    if (parts.length < 2) return [];

    const cityTo = parts[1].trim();
    if (!cityTo) return [];

    return this.routesRepository
      .createQueryBuilder('route')
      .select(['route.ID', 'route.url', 'route.title'])
      .where('route.is_whitelist = 1')
      .andWhere('route.url != :currentUrl', { currentUrl })
      .andWhere('route.city_seo_data LIKE :cityTo', { cityTo: `%,${cityTo}` })
      .limit(10)
      .getMany();
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
