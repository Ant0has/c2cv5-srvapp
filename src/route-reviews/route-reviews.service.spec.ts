import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RouteReviewsService } from './route-reviews.service';
import { RouteReview } from './route-review.entity';

describe('RouteReviewsService', () => {
  let service: RouteReviewsService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getCount: jest.fn(),
    getRawMany: jest.fn(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    find: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteReviewsService,
        {
          provide: getRepositoryToken(RouteReview),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RouteReviewsService>(RouteReviewsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
    // Re-apply returnThis after clearAllMocks
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();
    mockQueryBuilder.addOrderBy.mockReturnThis();
    mockQueryBuilder.limit.mockReturnThis();
    mockQueryBuilder.offset.mockReturnThis();
    mockQueryBuilder.take.mockReturnThis();
    mockQueryBuilder.skip.mockReturnThis();
    mockQueryBuilder.select.mockReturnThis();
    mockQueryBuilder.addSelect.mockReturnThis();
    mockQueryBuilder.groupBy.mockReturnThis();
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getReviewsByRouteUrl ─────────────────────────────────────────

  describe('getReviewsByRouteUrl', () => {
    const routeUrl = 'moskva-kazan.html';

    const mockReviews: Partial<RouteReview>[] = [
      {
        id: 2,
        route_url: routeUrl,
        username: 'Иван',
        city: 'Москва',
        rate: 5,
        route_display: 'Москва — Казань',
        review_text: 'Отличная поездка',
        review_date: new Date('2026-03-18'),
      },
      {
        id: 1,
        route_url: routeUrl,
        username: 'Мария',
        city: 'Казань',
        rate: 4,
        route_display: 'Москва — Казань',
        review_text: 'Хорошо доехали',
        review_date: new Date('2026-03-17'),
      },
    ];

    it('should return reviews ordered by date DESC', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockReviews);

      const result = await service.getReviewsByRouteUrl(routeUrl);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('review');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'review.route_url = :routeUrl',
        { routeUrl },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'review.review_date',
        'DESC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'review.id',
        'DESC',
      );
      expect(result).toEqual(mockReviews);
    });

    it('should apply limit when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockReviews[0]]);

      await service.getReviewsByRouteUrl(routeUrl, 1);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1);
    });

    it('should apply offset when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.getReviewsByRouteUrl(routeUrl, 10, 5);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(5);
    });

    it('should not apply limit or offset when not provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockReviews);

      await service.getReviewsByRouteUrl(routeUrl);

      expect(mockQueryBuilder.limit).not.toHaveBeenCalled();
      expect(mockQueryBuilder.offset).not.toHaveBeenCalled();
    });

    it('should return empty array when no reviews exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getReviewsByRouteUrl('nonexistent.html');

      expect(result).toEqual([]);
    });
  });

  // ─── getReviewStatsByRouteUrl ─────────────────────────────────────

  describe('getReviewStatsByRouteUrl', () => {
    const routeUrl = 'moskva-kazan.html';

    it('should return stats with correct total, average, and distribution', async () => {
      const reviews: Partial<RouteReview>[] = [
        { rate: 5 },
        { rate: 5 },
        { rate: 4 },
        { rate: 3 },
        { rate: 5 },
      ];
      mockRepository.find.mockResolvedValue(reviews);

      const result = await service.getReviewStatsByRouteUrl(routeUrl);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { route_url: routeUrl },
      });
      expect(result.total).toBe(5);
      // (5+5+4+3+5)/5 = 22/5 = 4.4
      expect(result.averageRating).toBe(4.4);
      expect(result.ratingDistribution).toEqual({ 3: 1, 4: 1, 5: 3 });
    });

    it('should return zeros and empty distribution when no reviews exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getReviewStatsByRouteUrl(routeUrl);

      expect(result).toEqual({
        total: 0,
        averageRating: 0,
        ratingDistribution: {},
      });
    });

    it('should round averageRating to 1 decimal place', async () => {
      // (5+4+4) / 3 = 13/3 = 4.333... → 4.3
      const reviews: Partial<RouteReview>[] = [
        { rate: 5 },
        { rate: 4 },
        { rate: 4 },
      ];
      mockRepository.find.mockResolvedValue(reviews);

      const result = await service.getReviewStatsByRouteUrl(routeUrl);

      expect(result.averageRating).toBe(4.3);
    });

    it('should round 4.666... to 4.7', async () => {
      // (5+5+4) / 3 = 14/3 = 4.666... → 4.7
      const reviews: Partial<RouteReview>[] = [
        { rate: 5 },
        { rate: 5 },
        { rate: 4 },
      ];
      mockRepository.find.mockResolvedValue(reviews);

      const result = await service.getReviewStatsByRouteUrl(routeUrl);

      expect(result.averageRating).toBe(4.7);
    });

    it('should handle single review', async () => {
      mockRepository.find.mockResolvedValue([{ rate: 3 }]);

      const result = await service.getReviewStatsByRouteUrl(routeUrl);

      expect(result.total).toBe(1);
      expect(result.averageRating).toBe(3);
      expect(result.ratingDistribution).toEqual({ 3: 1 });
    });
  });

  // ─── getReviewsByCities ──────────────────────────────────────────

  describe('getReviewsByCities', () => {
    const fromCity = 'Москва';
    const toCity = 'Казань';

    it('should search by LIKE pattern and return reviews with stats', async () => {
      const mockReviews: Partial<RouteReview>[] = [
        {
          id: 1,
          route_display: 'Москва — Казань',
          rate: 5,
          review_date: new Date('2026-03-18'),
        },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockReviews);
      mockQueryBuilder.getRawOne.mockResolvedValue({
        total: '10',
        avg: '4.6',
      });

      const result = await service.getReviewsByCities(fromCity, toCity, 5);

      // First createQueryBuilder call — reviews
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('review');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'review.route_display LIKE :pattern',
        { pattern: 'Москва%Казань' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'review.review_date',
        'DESC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'review.rate',
        'DESC',
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);

      expect(result.reviews).toEqual(mockReviews);
      expect(result.total).toBe(10);
      expect(result.averageRating).toBe(4.6);
    });

    it('should use default limit of 5', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getRawOne.mockResolvedValue({
        total: '0',
        avg: null,
      });

      await service.getReviewsByCities(fromCity, toCity);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });

    it('should return empty results when no reviews match', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getRawOne.mockResolvedValue(null);

      const result = await service.getReviewsByCities(fromCity, toCity, 5);

      expect(result.reviews).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.averageRating).toBe(0);
    });

    it('should handle null avg in countResult', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getRawOne.mockResolvedValue({
        total: '3',
        avg: null,
      });

      const result = await service.getReviewsByCities(fromCity, toCity, 5);

      expect(result.total).toBe(3);
      // parseFloat(null || '0') = 0
      expect(result.averageRating).toBe(0);
    });

    it('should round averageRating to 1 decimal', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      mockQueryBuilder.getRawOne.mockResolvedValue({
        total: '7',
        avg: '4.2857',
      });

      const result = await service.getReviewsByCities(fromCity, toCity, 5);

      expect(result.averageRating).toBe(4.3);
    });
  });

  // ─── getLatestReviews ─────────────────────────────────────────────

  describe('getLatestReviews', () => {
    it('should return latest reviews with default limit 10', async () => {
      const mockReviews: Partial<RouteReview>[] = [
        { id: 100, review_date: new Date('2026-03-18') },
        { id: 99, review_date: new Date('2026-03-17') },
      ];
      mockRepository.find.mockResolvedValue(mockReviews);

      const result = await service.getLatestReviews();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { review_date: 'DESC', id: 'DESC' },
        take: 10,
      });
      expect(result).toEqual(mockReviews);
    });

    it('should apply custom limit', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.getLatestReviews(3);

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { review_date: 'DESC', id: 'DESC' },
        take: 3,
      });
    });

    it('should return empty array when no reviews exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getLatestReviews();

      expect(result).toEqual([]);
    });
  });

  // ─── getReviewCountByRouteUrl ─────────────────────────────────────

  describe('getReviewCountByRouteUrl', () => {
    it('should return count of reviews for a route', async () => {
      mockRepository.count.mockResolvedValue(42);

      const result = await service.getReviewCountByRouteUrl(
        'moskva-kazan.html',
      );

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { route_url: 'moskva-kazan.html' },
      });
      expect(result).toBe(42);
    });

    it('should return 0 when no reviews exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getReviewCountByRouteUrl(
        'nonexistent.html',
      );

      expect(result).toBe(0);
    });
  });
});
