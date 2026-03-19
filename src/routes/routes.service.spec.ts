import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Routes } from 'src/routes/routes.entity';
import { Regions } from 'src/regions/regions.entity';
import { Attraction } from 'src/attractions/attraction.entity';
import { RouteReviewsService } from 'src/route-reviews/route-reviews.service';

describe('RoutesService', () => {
  let service: RoutesService;
  let routesRepository: Record<string, jest.Mock>;
  let regionsRepository: Record<string, jest.Mock>;
  let attractionsRepository: Record<string, jest.Mock>;
  let routeReviewsService: Record<string, jest.Mock>;

  const mockRoute = {
    ID: 1,
    url: 'moskva-tver',
    title: 'Москва — Тверь',
    region_id: 10,
    distance_km: 180,
    price_economy: 4500,
    is_whitelist: 1,
  } as unknown as Routes;

  const mockRegion = {
    ID: 10,
    name: 'Московская область',
  } as unknown as Regions;

  const mockRoutes = [
    { ID: 1, url: 'moskva-tver', title: 'Москва — Тверь' },
    { ID: 2, url: 'moskva-spb', title: 'Москва — Санкт-Петербург' },
    { ID: 3, url: 'moskva-kazan', title: 'Москва — Казань' },
  ];

  const mockAttractions = [
    { id: 1, name: 'Кремль', regionId: 10 },
    { id: 2, name: 'Тверской бульвар', regionId: 10 },
  ] as unknown as Attraction[];

  const mockReviews = [
    { id: 1, rate: 5, username: 'Иван', text: 'Отличная поездка' },
    { id: 2, rate: 4, username: 'Мария', text: 'Хороший сервис' },
  ];

  beforeEach(async () => {
    routesRepository = { findOne: jest.fn(), find: jest.fn() };
    regionsRepository = { findOne: jest.fn(), find: jest.fn() };
    attractionsRepository = { findOne: jest.fn(), find: jest.fn() };
    routeReviewsService = {
      getReviewsByRouteUrl: jest.fn(),
      getReviewCountByRouteUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: getRepositoryToken(Routes),
          useValue: routesRepository,
        },
        {
          provide: getRepositoryToken(Regions),
          useValue: regionsRepository,
        },
        {
          provide: getRepositoryToken(Attraction),
          useValue: attractionsRepository,
        },
        {
          provide: RouteReviewsService,
          useValue: routeReviewsService,
        },
      ],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoutDetails', () => {
    it('should return full route data with reviews, attractions, and routes', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routesRepository.find.mockResolvedValue(mockRoutes);
      attractionsRepository.find.mockResolvedValue(mockAttractions);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue(mockReviews);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(14);

      const result = await service.getRoutDetails('moskva-tver');

      expect(result.regions_data).toEqual(mockRegion);
      expect(result.attractions).toEqual(mockAttractions);
      expect(result.reviews.data).toEqual(mockReviews);
      expect(result.reviews.pagination).toEqual({
        total: 14,
        limit: 10,
        offset: 0,
        hasMore: true,
      });
      expect(routesRepository.findOne).toHaveBeenCalledWith({
        where: { url: 'moskva-tver' },
      });
      expect(regionsRepository.findOne).toHaveBeenCalledWith({
        where: { ID: 10 },
      });
      expect(routesRepository.find).toHaveBeenCalledWith({
        where: { region_id: 10, is_whitelist: 1 },
        select: ['ID', 'url', 'title'],
      });
      expect(attractionsRepository.find).toHaveBeenCalledWith({
        where: { regionId: 10 },
        order: { name: 'ASC' },
      });
      expect(routeReviewsService.getReviewsByRouteUrl).toHaveBeenCalledWith(
        'moskva-tver',
        10,
        0,
      );
      expect(routeReviewsService.getReviewCountByRouteUrl).toHaveBeenCalledWith(
        'moskva-tver',
      );
    });

    it('should throw NotFoundException when route not found', async () => {
      routesRepository.findOne.mockResolvedValue(null);

      await expect(service.getRoutDetails('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getRoutDetails('non-existent')).rejects.toThrow(
        'Данный маршрут отсутствует',
      );
    });

    it('should throw NotFoundException when region not found', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(null);

      await expect(service.getRoutDetails('moskva-tver')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getRoutDetails('moskva-tver')).rejects.toThrow(
        `Регион с id=${mockRoute.region_id} отсутствует`,
      );
    });

    it('should filter current route from region routes list', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routesRepository.find.mockResolvedValue(mockRoutes);
      attractionsRepository.find.mockResolvedValue([]);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue([]);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(0);

      const result = await service.getRoutDetails('moskva-tver');

      expect(result.routes).toHaveLength(2);
      expect(result.routes.find((r) => r.url === 'moskva-tver')).toBeUndefined();
      expect(result.routes).toEqual([
        { ID: 2, url: 'moskva-spb', title: 'Москва — Санкт-Петербург' },
        { ID: 3, url: 'moskva-kazan', title: 'Москва — Казань' },
      ]);
    });

    it('should set video fields for pskov-kpp_shumilkino route', async () => {
      const pskovRoute = {
        ...mockRoute,
        url: 'pskov-kpp_shumilkino',
      } as unknown as Routes;

      routesRepository.findOne.mockResolvedValue(pskovRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routesRepository.find.mockResolvedValue([]);
      attractionsRepository.find.mockResolvedValue([]);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue([]);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(0);

      const result = await service.getRoutDetails('pskov-kpp_shumilkino');

      expect(result.route_video_url).toBe('/videos/pskov-kpp_shumilkino.mp4');
      expect(result.route_video_thumbnail).toBe('/pskov-kpp_shumilkino-thumbnail.png');
    });

    it('should set empty video fields for non-pskov routes', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routesRepository.find.mockResolvedValue([]);
      attractionsRepository.find.mockResolvedValue([]);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue([]);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(0);

      const result = await service.getRoutDetails('moskva-tver');

      expect(result.route_video_url).toBe('');
      expect(result.route_video_thumbnail).toBe('');
    });

    it('should set hasMore to false when all reviews are loaded', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routesRepository.find.mockResolvedValue([]);
      attractionsRepository.find.mockResolvedValue([]);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue(mockReviews);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(5);

      const result = await service.getRoutDetails('moskva-tver');

      expect(result.reviews.pagination.hasMore).toBe(false);
    });
  });

  describe('getRouteDetailsWithReviews', () => {
    it('should return route with reviews pagination', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue(mockReviews);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(25);

      const result = await service.getRouteDetailsWithReviews('moskva-tver');

      expect(result.regions_data).toEqual(mockRegion);
      expect(result.reviews.data).toEqual(mockReviews);
      expect(result.reviews.pagination).toEqual({
        total: 25,
        limit: 10,
        offset: 0,
        hasMore: true,
      });
    });

    it('should throw NotFoundException when route not found', async () => {
      routesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getRouteDetailsWithReviews('non-existent'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getRouteDetailsWithReviews('non-existent'),
      ).rejects.toThrow('Данный маршрут отсутствует');
    });

    it('should throw NotFoundException when region not found', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getRouteDetailsWithReviews('moskva-tver'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should use provided limit and offset', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue(mockReviews);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(50);

      const result = await service.getRouteDetailsWithReviews('moskva-tver', 20, 30);

      expect(routeReviewsService.getReviewsByRouteUrl).toHaveBeenCalledWith(
        'moskva-tver',
        20,
        30,
      );
      expect(result.reviews.pagination).toEqual({
        total: 50,
        limit: 20,
        offset: 30,
        hasMore: false,
      });
    });

    it('should default limit to 10 and offset to 0', async () => {
      routesRepository.findOne.mockResolvedValue(mockRoute);
      regionsRepository.findOne.mockResolvedValue(mockRegion);
      routeReviewsService.getReviewsByRouteUrl.mockResolvedValue([]);
      routeReviewsService.getReviewCountByRouteUrl.mockResolvedValue(0);

      await service.getRouteDetailsWithReviews('moskva-tver');

      expect(routeReviewsService.getReviewsByRouteUrl).toHaveBeenCalledWith(
        'moskva-tver',
        10,
        0,
      );
    });
  });
});
