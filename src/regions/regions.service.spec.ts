import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegionsService } from './regions.service';
import { Regions } from './regions.entity';
import { Routes } from '../routes/routes.entity';
import { Posts } from './posts.entity';
import { PostMeta } from './post-meta.entity';

describe('RegionsService', () => {
  let service: RegionsService;
  let regionsRepository: Record<string, jest.Mock>;
  let routesRepository: Record<string, jest.Mock>;
  let postsRepository: Record<string, jest.Mock>;
  let postMetaRepository: Record<string, jest.Mock>;

  const mockRegion = {
    ID: 10,
    meta_value: 'Московская область',
    url: 'moskovskaya-oblast',
    address: 'Москва',
    phone_number: '+7999',
  } as unknown as Regions;

  const mockRegions = [
    { ID: 10, meta_value: 'Московская область', url: 'moskovskaya-oblast' },
    { ID: 11, meta_value: 'Ленинградская область', url: 'leningradskaya-oblast' },
  ] as unknown as Regions[];

  const mockPost = {
    ID: 100,
    post_title: 'Москва — Тверь',
    post_content: 'Контент',
    post_name: 'moskva-tver',
  } as unknown as Posts;

  const mockPostMeta = [
    { meta_id: 1, post_id: 100, meta_key: 'FromRegion', meta_value: 'Московская область' },
    { meta_id: 2, post_id: 100, meta_key: 'FromCity', meta_value: 'Москва' },
    { meta_id: 3, post_id: 100, meta_key: 'ToCity', meta_value: 'Тверь' },
    { meta_id: 4, post_id: 100, meta_key: 'FromCitySeo', meta_value: 'Москва' },
    { meta_id: 5, post_id: 100, meta_key: 'ToCitySeo', meta_value: 'Тверь' },
    { meta_id: 6, post_id: 100, meta_key: '_yoast_wpseo_title', meta_value: 'SEO Title' },
    { meta_id: 7, post_id: 100, meta_key: '_yoast_wpseo_metadesc', meta_value: 'SEO Desc' },
    { meta_id: 8, post_id: 100, meta_key: 'km', meta_value: '180' },
  ] as unknown as PostMeta[];

  const mockRoute = {
    ID: 1,
    title: 'Москва — Тверь',
    url: 'moskva-tver',
  } as unknown as Routes;

  beforeEach(async () => {
    regionsRepository = {
      find: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    };
    routesRepository = {
      find: jest.fn(),
      insert: jest.fn(),
    };
    postsRepository = {
      find: jest.fn(),
    };
    postMetaRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionsService,
        { provide: getRepositoryToken(Regions), useValue: regionsRepository },
        { provide: getRepositoryToken(Routes), useValue: routesRepository },
        { provide: getRepositoryToken(Posts), useValue: postsRepository },
        { provide: getRepositoryToken(PostMeta), useValue: postMetaRepository },
      ],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
  });

  describe('getRegions', () => {
    it('should return all regions', async () => {
      regionsRepository.find.mockResolvedValue(mockRegions);
      const result = await service.getRegions();
      expect(result).toEqual(mockRegions);
      expect(regionsRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no regions', async () => {
      regionsRepository.find.mockResolvedValue([]);
      const result = await service.getRegions();
      expect(result).toEqual([]);
    });
  });

  describe('getPosts', () => {
    it('should return posts with ID 41', async () => {
      postsRepository.find.mockResolvedValue([mockPost]);
      const result = await service.getPosts();
      expect(result).toEqual([mockPost]);
      expect(postsRepository.find).toHaveBeenCalledWith({ where: { ID: 41 } });
    });
  });

  describe('getTrueRegions', () => {
    it('should return all regions', async () => {
      regionsRepository.find.mockResolvedValue(mockRegions);
      const result = await service.getTrueRegions();
      expect(result).toEqual(mockRegions);
    });
  });

  describe('getRoutes', () => {
    it('should return all routes', async () => {
      routesRepository.find.mockResolvedValue([mockRoute]);
      const result = await service.getRoutes();
      expect(result).toEqual([mockRoute]);
    });
  });

  describe('getRoutesByRegion', () => {
    it('should return routes filtered by region id', async () => {
      routesRepository.find.mockResolvedValue([mockRoute]);
      const result = await service.getRoutesByRegion(10);
      expect(result).toEqual([mockRoute]);
      expect(routesRepository.find).toHaveBeenCalledWith({
        where: { region_id: 10 },
      });
    });

    it('should return empty array for unknown region', async () => {
      routesRepository.find.mockResolvedValue([]);
      const result = await service.getRoutesByRegion(999);
      expect(result).toEqual([]);
    });
  });

  describe('addRoutesByRegion', () => {
    it('should return error string when region not found', async () => {
      regionsRepository.find.mockResolvedValue([]);
      const result = await service.addRoutesByRegion('unknown-url');
      expect(result).toBe('Не пришел url');
    });

    it('should return error string when no post meta data', async () => {
      regionsRepository.find.mockResolvedValue([mockRegion]);
      postMetaRepository.find.mockResolvedValueOnce([]); // FromRegion query
      const result = await service.addRoutesByRegion('moskovskaya-oblast');
      expect(result).toBe('Нет данных для региона');
    });

    it('should insert new routes and skip existing ones', async () => {
      regionsRepository.find.mockResolvedValue([mockRegion]);
      // First postMeta.find: FromRegion lookup
      postMetaRepository.find.mockResolvedValueOnce([
        { post_id: 100, meta_key: 'FromRegion', meta_value: 'Московская область' },
      ]);
      // Promise.all: posts + meta
      postsRepository.find.mockResolvedValue([mockPost]);
      postMetaRepository.find.mockResolvedValueOnce(mockPostMeta);
      // Existing routes check — empty, so new route will be inserted
      routesRepository.find.mockResolvedValue([]);
      routesRepository.insert.mockResolvedValue({});

      const result = await service.addRoutesByRegion('moskovskaya-oblast');
      expect(typeof result).toBe('object');
      if (typeof result === 'object') {
        expect(result.message).toBe('Операция успешно завершена');
        expect(result.routes.length).toBe(1);
        expect(result.routes[0]).toMatchObject({
          city_data: 'Москва,Тверь',
          city_seo_data: 'Москва,Тверь',
          title: 'Москва — Тверь',
          seo_title: 'SEO Title',
          seo_description: 'SEO Desc',
          distance: '180',
        });
      }
      expect(routesRepository.insert).toHaveBeenCalled();
    });

    it('should skip routes that already exist', async () => {
      regionsRepository.find.mockResolvedValue([mockRegion]);
      postMetaRepository.find.mockResolvedValueOnce([
        { post_id: 100, meta_key: 'FromRegion', meta_value: 'Московская область' },
      ]);
      postsRepository.find.mockResolvedValue([mockPost]);
      postMetaRepository.find.mockResolvedValueOnce(mockPostMeta);
      // Route already exists
      routesRepository.find.mockResolvedValue([{ title: 'Москва — Тверь' }]);

      const result = await service.addRoutesByRegion('moskovskaya-oblast');
      expect(typeof result).toBe('object');
      if (typeof result === 'object') {
        expect(result.routes.length).toBe(0);
      }
      expect(routesRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('updateRegionDataById', () => {
    it('should update region and return it', async () => {
      const updatedRegion = { ...mockRegion, address: 'Новый адрес' };
      regionsRepository.find.mockResolvedValue([mockRegion]);
      regionsRepository.save.mockResolvedValue(updatedRegion);

      const result = await service.updateRegionDataById(10, { address: 'Новый адрес' });
      expect(result).toEqual(updatedRegion);
      expect(regionsRepository.save).toHaveBeenCalled();
    });

    it('should throw error when region not found', async () => {
      regionsRepository.find.mockResolvedValue([]);
      await expect(
        service.updateRegionDataById(999, { address: 'Test' }),
      ).rejects.toThrow('Запись не найдена');
    });
  });

  describe('deleteRegionById', () => {
    it('should delete region by id', async () => {
      const deleteResult = { affected: 1, raw: {} };
      regionsRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteRegionById(10);
      expect(result).toEqual(deleteResult);
      expect(regionsRepository.delete).toHaveBeenCalledWith(10);
    });
  });

  describe('processRegions', () => {
    it('should process all regions with URLs', async () => {
      regionsRepository.find.mockResolvedValueOnce([mockRegion]);
      // addRoutesByRegion will be called — mock its internal calls
      regionsRepository.find.mockResolvedValueOnce([mockRegion]);
      postMetaRepository.find.mockResolvedValueOnce([]);

      await service.processRegions();
      // Should not throw
      expect(regionsRepository.find).toHaveBeenCalled();
    });

    it('should log warning for regions without URL', async () => {
      const regionNoUrl = { ...mockRegion, url: '' } as unknown as Regions;
      regionsRepository.find.mockResolvedValueOnce([regionNoUrl]);

      await service.processRegions();
      // Should not throw even with no URL
      expect(regionsRepository.find).toHaveBeenCalled();
    });
  });
});
