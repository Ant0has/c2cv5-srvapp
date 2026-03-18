import { Test, TestingModule } from '@nestjs/testing';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';

describe('RegionsController', () => {
  let controller: RegionsController;
  let service: RegionsService;

  const mockRegion = {
    id: 1,
    name: 'Московская область',
    url: 'moskovskaya-oblast',
  };

  const mockRegions = [
    mockRegion,
    { id: 2, name: 'Тверская область', url: 'tverskaya-oblast' },
  ];

  const mockPosts = [
    { id: 1, post_title: 'Пост 1', post_content: 'Контент 1' },
    { id: 2, post_title: 'Пост 2', post_content: 'Контент 2' },
  ];

  const mockRoutes = [
    { ID: 1, url: 'moskva-tver', title: 'Москва — Тверь' },
    { ID: 2, url: 'moskva-spb', title: 'Москва — СПб' },
  ];

  const mockDeleteResult = { raw: [], affected: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionsController],
      providers: [
        {
          provide: RegionsService,
          useValue: {
            getRegions: jest.fn().mockResolvedValue(mockRegions),
            getPosts: jest.fn().mockResolvedValue(mockPosts),
            updateRegionDataById: jest.fn().mockResolvedValue({ ...mockRegion, name: 'Updated' }),
            deleteRegionById: jest.fn().mockResolvedValue(mockDeleteResult),
            addRoutesByRegion: jest.fn().mockResolvedValue({ message: 'Routes added', routes: [] }),
            addRoutesForCrym: jest.fn().mockResolvedValue({ message: 'Crimea routes added', routes: [] }),
            getRoutesByRegion: jest.fn().mockResolvedValue(mockRoutes),
            processRegions: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<RegionsController>(RegionsController);
    service = module.get<RegionsService>(RegionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all regions', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockRegions);
      expect(service.getRegions).toHaveBeenCalled();
    });
  });

  describe('getPosts', () => {
    it('should return posts', async () => {
      const result = await controller.getPosts();
      expect(result).toEqual(mockPosts);
      expect(service.getPosts).toHaveBeenCalled();
    });
  });

  describe('updateRegionDataById', () => {
    it('should update a region by id', async () => {
      const dto = { name: 'Updated' };
      const result = await controller.updateRegionDataById(1, dto as any);
      expect(result).toEqual({ ...mockRegion, name: 'Updated' });
      expect(service.updateRegionDataById).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteRegionById', () => {
    it('should delete a region by id', async () => {
      const result = await controller.deleteRegionById(1);
      expect(result).toEqual(mockDeleteResult);
      expect(service.deleteRegionById).toHaveBeenCalledWith(1);
    });
  });

  describe('addRoutesByRegion', () => {
    it('should add routes by region url', async () => {
      const result = await controller.addRoutesByRegion('moskovskaya-oblast');
      expect(result).toEqual({ message: 'Routes added', routes: [] });
      expect(service.addRoutesByRegion).toHaveBeenCalledWith('moskovskaya-oblast');
    });
  });

  describe('addRoutesForCrym', () => {
    it('should add routes for Crimea', async () => {
      const result = await controller.addRoutesForCrym();
      expect(result).toEqual({ message: 'Crimea routes added', routes: [] });
      expect(service.addRoutesForCrym).toHaveBeenCalled();
    });
  });

  describe('getRoutesByRegion', () => {
    it('should return routes for a region', async () => {
      const result = await controller.getRoutesByRegion(1);
      expect(result).toEqual(mockRoutes);
      expect(service.getRoutesByRegion).toHaveBeenCalledWith(1);
    });
  });

  describe('processRegions', () => {
    it('should process all regions', async () => {
      await controller.processRegions();
      expect(service.processRegions).toHaveBeenCalled();
    });
  });
});
