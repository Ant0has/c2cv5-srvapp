import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoutesAttractionsService } from './routes-attractions.service';
import { AttractionImage } from 'src/attractions/attraction-image.entity';

// Mock regionsData
jest.mock('src/data', () => ({
  regionsData: [
    { ID: 1, region_code: '77' },
    { ID: 10, region_code: '50' },
    { ID: 11, region_code: '69' },
  ],
}));

describe('RoutesAttractionsService', () => {
  let service: RoutesAttractionsService;
  let attractionImageRepository: Record<string, jest.Mock>;

  const mockImages = [
    { id: 1, region: '77', name: 'кремль', size: '800x600', path: '/images/kremlin.jpg' },
    { id: 2, region: '77', name: 'москва-сити', size: '800x600', path: '/images/city.jpg' },
    { id: 3, region: '50', name: 'тверь-центр', size: '800x600', path: '/images/tver.jpg' },
    { id: 4, region: '69', name: 'казань-кремль', size: '800x600', path: '/images/kazan.jpg' },
  ] as unknown as AttractionImage[];

  beforeEach(async () => {
    attractionImageRepository = {
      find: jest.fn().mockResolvedValue(mockImages),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesAttractionsService,
        { provide: getRepositoryToken(AttractionImage), useValue: attractionImageRepository },
      ],
    }).compile();

    service = module.get<RoutesAttractionsService>(RoutesAttractionsService);
  });

  describe('findImagesForRoute', () => {
    it('should return images matching URL words', async () => {
      const result = await service.findImagesForRoute({
        url: 'moskva-tver',
        title: 'Москва — Тверь',
        region_id: 1,
      });

      expect(result.name).toBe('Москва — Тверь');
      expect(result.region_id).toBe(1);
      expect(result.region_code).toBe('77');
      expect(result.url).toBe('moskva-tver');
      // Should find images by region 77
      expect(result.images.length).toBeGreaterThan(0);
    });

    it('should include region_code from regionsData', async () => {
      const result = await service.findImagesForRoute({
        url: 'test-route',
        title: 'Test',
        region_id: 10,
      });

      expect(result.region_code).toBe('50');
    });

    it('should return undefined region_code for unknown region', async () => {
      const result = await service.findImagesForRoute({
        url: 'test-route',
        title: 'Test',
        region_id: 999,
      });

      expect(result.region_code).toBeUndefined();
    });

    it('should match images by name containing URL words', async () => {
      const result = await service.findImagesForRoute({
        url: 'кремль-маршрут',
        title: 'Маршрут к Кремлю',
        region_id: 999, // non-matching region
      });

      const hasKremlin = result.images.some(img => img.name.includes('кремль'));
      expect(hasKremlin).toBe(true);
    });

    it('should match images by region code', async () => {
      const result = await service.findImagesForRoute({
        url: 'unknown-route',
        title: 'Unknown',
        region_id: 1, // region_code 77
      });

      const regionMatches = result.images.filter(img => img.region === '77');
      expect(regionMatches.length).toBeGreaterThan(0);
    });

    it('should combine name and region matches', async () => {
      const result = await service.findImagesForRoute({
        url: 'тверь-маршрут',
        title: 'Тверь маршрут',
        region_id: 1, // region 77
      });

      // Should have both: name match (тверь) + region match (77)
      expect(result.images.length).toBeGreaterThan(0);
    });

    it('should use city_seo_data for matching', async () => {
      const result = await service.findImagesForRoute({
        url: 'some-route',
        title: 'Some Route',
        region_id: 999,
        city_seo_data: 'кремль,тверь',
      });

      // Should match by city_seo_data words
      expect(result.images.length).toBeGreaterThan(0);
    });

    it('should return empty images when nothing matches', async () => {
      attractionImageRepository.find.mockResolvedValue([]);

      const result = await service.findImagesForRoute({
        url: 'test',
        title: 'Test',
        region_id: 999,
      });

      expect(result.images).toEqual([]);
    });

    it('should return correct structure', async () => {
      const result = await service.findImagesForRoute({
        url: 'route-url',
        title: 'Route Title',
        region_id: 1,
      });

      expect(result).toHaveProperty('name', 'Route Title');
      expect(result).toHaveProperty('region_id', 1);
      expect(result).toHaveProperty('region_code');
      expect(result).toHaveProperty('url', 'route-url');
      expect(result).toHaveProperty('description', '');
      expect(result).toHaveProperty('images');
      expect(Array.isArray(result.images)).toBe(true);
    });

    it('should handle missing city_seo_data gracefully', async () => {
      const result = await service.findImagesForRoute({
        url: 'test',
        title: 'Test',
        region_id: 1,
      });

      // Should not throw and should still return results
      expect(result).toBeDefined();
      expect(result.images).toBeDefined();
    });

    it('should filter out empty and dash search terms', async () => {
      const result = await service.findImagesForRoute({
        url: '---',
        title: '- -',
        region_id: 999,
        city_seo_data: '-,-',
      });

      // With all empty/dash terms filtered, should only get region matches (none for 999)
      expect(result.images).toEqual([]);
    });
  });
});
