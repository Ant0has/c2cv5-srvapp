import { Test, TestingModule } from '@nestjs/testing';
import { RouteReviewsController } from './route-reviews.controller';
import { RouteReviewsService } from './route-reviews.service';

describe('RouteReviewsController', () => {
  let controller: RouteReviewsController;
  let service: RouteReviewsService;

  const mockReviews = [
    { id: 1, route_url: 'moskva-tver', username: 'Иван', rate: 5, review_text: 'Отлично' },
    { id: 2, route_url: 'moskva-tver', username: 'Мария', rate: 4, review_text: 'Хорошо' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteReviewsController],
      providers: [
        {
          provide: RouteReviewsService,
          useValue: {
            getReviewsByRouteUrl: jest.fn().mockResolvedValue(mockReviews),
            getReviewStatsByRouteUrl: jest.fn().mockResolvedValue({
              total: 14,
              averageRating: 4.7,
              ratingDistribution: { 5: 10, 4: 3, 3: 1 },
            }),
            getReviewsByCities: jest.fn().mockResolvedValue({
              reviews: mockReviews,
              total: 2,
              averageRating: 4.5,
            }),
            getLatestReviews: jest.fn().mockResolvedValue(mockReviews),
            getReviewCountByRouteUrl: jest.fn().mockResolvedValue(14),
          },
        },
      ],
    }).compile();

    controller = module.get<RouteReviewsController>(RouteReviewsController);
    service = module.get<RouteReviewsService>(RouteReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReviewsByRouteUrl', () => {
    it('should return reviews for route', async () => {
      const result = await controller.getReviewsByRouteUrl('moskva-tver', 10, 0);
      expect(result).toEqual(mockReviews);
      expect(service.getReviewsByRouteUrl).toHaveBeenCalledWith('moskva-tver', 10, 0);
    });
  });

  describe('getReviewStats', () => {
    it('should return stats with average rating', async () => {
      const result = await controller.getReviewStats('moskva-tver');
      expect(result.averageRating).toBe(4.7);
      expect(result.total).toBe(14);
    });
  });

  describe('getReviewCount', () => {
    it('should return count object', async () => {
      const result = await controller.getReviewCount('moskva-tver');
      expect(result).toEqual({ count: 14 });
    });
  });

  describe('getLatestReviews', () => {
    it('should return latest reviews', async () => {
      const result = await controller.getLatestReviews(5);
      expect(result).toEqual(mockReviews);
      expect(service.getLatestReviews).toHaveBeenCalledWith(5);
    });
  });
});
