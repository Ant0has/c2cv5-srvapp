import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AttractionsController } from './attractions.controller';
import { AttractionsService } from './attractions.service';

describe('AttractionsController', () => {
  let controller: AttractionsController;
  let service: AttractionsService;

  const mockAttraction = {
    id: 1,
    regionId: 1,
    regionCode: 'moscow',
    imageDesktop: 'desktop.jpg',
    imageMobile: 'mobile.jpg',
    name: 'Кремль',
    description: 'Московский Кремль',
  };

  const mockAttractions = [
    mockAttraction,
    { id: 2, regionId: 1, regionCode: 'moscow', imageDesktop: 'd2.jpg', imageMobile: 'm2.jpg', name: 'Красная площадь', description: '' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractionsController],
      providers: [
        {
          provide: AttractionsService,
          useValue: {
            createAttraction: jest.fn().mockResolvedValue(mockAttraction),
            getTransformedData: jest.fn().mockResolvedValue(mockAttractions),
            findAttractionsByRegionId: jest.fn().mockResolvedValue(mockAttractions),
            findOneAttraction: jest.fn().mockResolvedValue(mockAttraction),
            generateTableData: jest.fn().mockResolvedValue({ message: 'Table refreshed' }),
            getImagesList: jest.fn().mockResolvedValue(['img1.jpg', 'img2.jpg']),
            transformAndSaveAttractionsData: jest.fn().mockResolvedValue(mockAttractions),
            updateAttraction: jest.fn().mockResolvedValue({ ...mockAttraction, name: 'Updated' }),
            removeAttraction: jest.fn().mockResolvedValue(undefined),
            gptGenerate: jest.fn().mockResolvedValue({ ...mockAttraction, message: 'Generated' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AttractionsController>(AttractionsController);
    service = module.get<AttractionsService>(AttractionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an attraction', async () => {
      const createData = {
        regionId: 1,
        regionCode: 'moscow',
        imageDesktop: 'desktop.jpg',
        imageMobile: 'mobile.jpg',
        name: 'Кремль',
      };
      const result = await controller.create(createData);
      expect(result).toEqual(mockAttraction);
      expect(service.createAttraction).toHaveBeenCalledWith(createData);
    });
  });

  describe('getAttractions', () => {
    it('should return all attractions', async () => {
      const result = await controller.getAttractions();
      expect(result).toEqual(mockAttractions);
      expect(service.getTransformedData).toHaveBeenCalled();
    });
  });

  describe('getByRegion', () => {
    it('should return attractions by region id', async () => {
      const result = await controller.getByRegion(1);
      expect(result).toEqual(mockAttractions);
      expect(service.findAttractionsByRegionId).toHaveBeenCalledWith(1);
    });
  });

  describe('getOne', () => {
    it('should return a single attraction by id', async () => {
      const result = await controller.getOne(1);
      expect(result).toEqual(mockAttraction);
      expect(service.findOneAttraction).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent attraction', async () => {
      jest.spyOn(service, 'findOneAttraction').mockRejectedValue(
        new NotFoundException('Attraction not found'),
      );
      await expect(controller.getOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('refreshTable', () => {
    it('should refresh table data', async () => {
      const result = await controller.refreshTable();
      expect(result).toEqual({ message: 'Table refreshed' });
      expect(service.generateTableData).toHaveBeenCalled();
    });
  });

  describe('getImagesList', () => {
    it('should return images list', async () => {
      const result = await controller.getImagesList();
      expect(result).toEqual(['img1.jpg', 'img2.jpg']);
      expect(service.getImagesList).toHaveBeenCalled();
    });
  });

  describe('transformData', () => {
    it('should transform and return data with message', async () => {
      const result = await controller.transformData();
      expect(result.message).toBe(`Successfully transformed ${mockAttractions.length} attractions`);
      expect(result.data).toEqual(mockAttractions);
      expect(service.transformAndSaveAttractionsData).toHaveBeenCalled();
    });
  });

  describe('updateAttraction', () => {
    it('should update an attraction', async () => {
      const updateData = { name: 'Updated' };
      const result = await controller.updateAttraction(1, updateData as any);
      expect(result).toEqual({ ...mockAttraction, name: 'Updated' });
      expect(service.updateAttraction).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('remove', () => {
    it('should remove an attraction and return success message', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Attraction with ID 1 deleted successfully' });
      expect(service.removeAttraction).toHaveBeenCalledWith(1);
    });
  });

  describe('gptGenerate', () => {
    it('should generate description via Yandex GPT', async () => {
      const result = await controller.gptGenerate(1);
      expect(result).toEqual({ ...mockAttraction, message: 'Generated' });
      expect(service.gptGenerate).toHaveBeenCalledWith(1);
    });
  });
});
