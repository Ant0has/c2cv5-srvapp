import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RoutesAttractionsService } from './routes-attractions.service';

describe('RoutesController', () => {
  let controller: RoutesController;
  let routesService: RoutesService;

  const mockRoute = {
    ID: 1,
    url: 'moskva-tver',
    title: 'Москва — Тверь',
    distance_km: 180,
    price_economy: 4500,
    regions_data: { ID: 1 },
    routes: [],
    attractions: [],
    reviews: {
      data: [{ id: 1, rate: 5, username: 'Иван' }],
      pagination: { total: 14, limit: 10, offset: 0, hasMore: true },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        {
          provide: RoutesService,
          useValue: {
            getRoutDetails: jest.fn().mockResolvedValue(mockRoute),
            getRouteDetailsWithReviews: jest.fn().mockResolvedValue(mockRoute),
          },
        },
        {
          provide: RoutesAttractionsService,
          useValue: {
            findImagesForRoute: jest.fn().mockResolvedValue({ ...mockRoute, images: [] }),
          },
        },
      ],
    }).compile();

    controller = module.get<RoutesController>(RoutesController);
    routesService = module.get<RoutesService>(RoutesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoutDetails', () => {
    it('should return route details', async () => {
      const result = await controller.getRoutDetails({ url: 'moskva-tver' });
      expect(result).toEqual(mockRoute);
      expect(routesService.getRoutDetails).toHaveBeenCalledWith('moskva-tver');
    });

    it('should throw NotFoundException for non-existent route', async () => {
      jest.spyOn(routesService, 'getRoutDetails').mockRejectedValue(
        new NotFoundException('Данный маршрут отсутствует'),
      );
      await expect(
        controller.getRoutDetails({ url: 'non-existent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRouteReviews', () => {
    it('should return reviews with pagination', async () => {
      const result = await controller.getRouteReviews(
        { url: 'moskva-tver' },
        { limit: 10, offset: 0 },
      );
      expect(result).toEqual(mockRoute.reviews);
    });

    it('should cap limit at 100', async () => {
      await controller.getRouteReviews(
        { url: 'moskva-tver' },
        { limit: 999, offset: 0 },
      );
      expect(routesService.getRouteDetailsWithReviews).toHaveBeenCalledWith(
        'moskva-tver',
        100,
        0,
      );
    });

    it('should default limit to 10 and offset to 0', async () => {
      await controller.getRouteReviews(
        { url: 'moskva-tver' },
        {},
      );
      expect(routesService.getRouteDetailsWithReviews).toHaveBeenCalledWith(
        'moskva-tver',
        10,
        0,
      );
    });
  });
});
