import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteReview } from './route-review.entity';

@Injectable()
export class RouteReviewsService {
  constructor(
    @InjectRepository(RouteReview)
    private routeReviewsRepository: Repository<RouteReview>,
  ) {}

  /**
   * Получить отзывы по URL маршрута
   */
  async getReviewsByRouteUrl(
    routeUrl: string,
    limit?: number,
    offset?: number,
  ): Promise<RouteReview[]> {
    const query = this.routeReviewsRepository
      .createQueryBuilder('review')
      .where('review.route_url = :routeUrl', { routeUrl })
      .orderBy('review.review_date', 'DESC')
      .addOrderBy('review.id', 'DESC');

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }

    return query.getMany();
  }

  /**
   * Получить статистику отзывов по маршруту
   */
  async getReviewStatsByRouteUrl(routeUrl: string): Promise<{
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await this.routeReviewsRepository.find({
      where: { route_url: routeUrl },
    });

    if (reviews.length === 0) {
      return {
        total: 0,
        averageRating: 0,
        ratingDistribution: {},
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
    const averageRating = total > 0 ? sum / total : 0;

    // Распределение по оценкам
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rate] = (acc[review.rate] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      total,
      averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
      ratingDistribution,
    };
  }

  async getLatestReviews(limit: number = 10): Promise<RouteReview[]> {
    return this.routeReviewsRepository.find({
      order: {
        review_date: 'DESC',
        id: 'DESC',
      },
      take: limit,
    });
  }

  async getReviewCountByRouteUrl(routeUrl: string): Promise<number> {
    return this.routeReviewsRepository.count({
      where: { route_url: routeUrl },
    });
  }
}