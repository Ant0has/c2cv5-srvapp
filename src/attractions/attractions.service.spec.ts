import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttractionsService } from './attractions.service';
import { Attraction } from './attraction.entity';
import { AttractionImage } from './attraction-image.entity';
import { YandexGptService } from './yandex-gpt.service';

jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    readdirSync: jest.fn(),
    writeFileSync: jest.fn(),
  };
});

describe('AttractionsService', () => {
  let service: AttractionsService;
  let attractionsRepository: Repository<Attraction>;
  let attractionImageRepository: Repository<AttractionImage>;
  let yandexGptService: YandexGptService;

  const mockAttraction: Attraction = {
    id: 1,
    regionId: 1,
    regionCode: 'moscow',
    imageDesktop: '/attractions/moscow-kremlin-desktop.jpg',
    imageMobile: '/attractions/moscow-kremlin-mobile.jpg',
    name: 'kremlin',
    description: '',
    createdAt: new Date('2026-01-01'),
  };

  const mockAttractionWithDescription: Attraction = {
    ...mockAttraction,
    id: 2,
    name: 'red-square',
    description: '<p>Красная площадь</p>',
  };

  const mockImage: AttractionImage = {
    id: 1,
    region: 'moscow',
    name: 'kremlin',
    size: 'desktop',
    path: '/attractions/moscow-kremlin-desktop.jpg',
  };

  const mockImages: AttractionImage[] = [
    mockImage,
    { id: 2, region: 'moscow', name: 'kremlin', size: 'mobile', path: '/attractions/moscow-kremlin-mobile.jpg' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttractionsService,
        {
          provide: getRepositoryToken(Attraction),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AttractionImage),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: YandexGptService,
          useValue: {
            generate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttractionsService>(AttractionsService);
    attractionsRepository = module.get<Repository<Attraction>>(getRepositoryToken(Attraction));
    attractionImageRepository = module.get<Repository<AttractionImage>>(getRepositoryToken(AttractionImage));
    yandexGptService = module.get<YandexGptService>(YandexGptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getImagesList', () => {
    it('should return all images from the repository', async () => {
      jest.spyOn(attractionImageRepository, 'find').mockResolvedValue(mockImages);

      const result = await service.getImagesList();

      expect(result).toEqual(mockImages);
      expect(attractionImageRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no images exist', async () => {
      jest.spyOn(attractionImageRepository, 'find').mockResolvedValue([]);

      const result = await service.getImagesList();

      expect(result).toEqual([]);
    });
  });

  describe('getTransformedData', () => {
    it('should return all attractions from the repository', async () => {
      const attractions = [mockAttraction, mockAttractionWithDescription];
      jest.spyOn(attractionsRepository, 'find').mockResolvedValue(attractions);

      const result = await service.getTransformedData();

      expect(result).toEqual(attractions);
      expect(attractionsRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no attractions exist', async () => {
      jest.spyOn(attractionsRepository, 'find').mockResolvedValue([]);

      const result = await service.getTransformedData();

      expect(result).toEqual([]);
    });
  });

  describe('findOneAttraction', () => {
    it('should return an attraction when found', async () => {
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(mockAttraction);

      const result = await service.findOneAttraction(1);

      expect(result).toEqual(mockAttraction);
      expect(attractionsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when attraction is not found', async () => {
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneAttraction(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOneAttraction(999)).rejects.toThrow('Attraction with ID 999 not found');
    });
  });

  describe('findAttractionsByRegionId', () => {
    it('should return attractions for a given region id', async () => {
      const attractions = [mockAttraction, mockAttractionWithDescription];
      jest.spyOn(attractionsRepository, 'find').mockResolvedValue(attractions);

      const result = await service.findAttractionsByRegionId(1);

      expect(result).toEqual(attractions);
      expect(attractionsRepository.find).toHaveBeenCalledWith({
        where: { regionId: 1 },
        order: { name: 'ASC' },
      });
    });

    it('should return an empty array when no attractions exist for region', async () => {
      jest.spyOn(attractionsRepository, 'find').mockResolvedValue([]);

      const result = await service.findAttractionsByRegionId(999);

      expect(result).toEqual([]);
    });
  });

  describe('updateAttraction', () => {
    it('should update and return the attraction', async () => {
      const updateDto = { name: 'Updated Name', description: 'New desc' };
      const updatedAttraction = { ...mockAttraction, ...updateDto };

      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue({ ...mockAttraction });
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue(updatedAttraction);

      const result = await service.updateAttraction(1, updateDto);

      expect(result).toEqual(updatedAttraction);
      expect(attractionsRepository.save).toHaveBeenCalled();
    });

    it('should only update provided fields', async () => {
      const updateDto = { name: 'Updated Name' };
      const savedAttraction = { ...mockAttraction, name: 'Updated Name' };

      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue({ ...mockAttraction });
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue(savedAttraction);

      await service.updateAttraction(1, updateDto);

      const saveCall = (attractionsRepository.save as jest.Mock).mock.calls[0][0];
      expect(saveCall.name).toBe('Updated Name');
      expect(saveCall.regionCode).toBe(mockAttraction.regionCode);
    });

    it('should throw NotFoundException when attraction does not exist', async () => {
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateAttraction(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('createAttraction', () => {
    it('should create and return a new attraction', async () => {
      const createData = {
        regionId: 1,
        regionCode: 'moscow',
        imageDesktop: 'desktop.jpg',
        imageMobile: 'mobile.jpg',
        name: 'New Attraction',
      };

      jest.spyOn(attractionsRepository, 'create').mockReturnValue({ ...mockAttraction, ...createData, description: '' });
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue({ ...mockAttraction, ...createData, description: '' });

      const result = await service.createAttraction(createData);

      expect(attractionsRepository.create).toHaveBeenCalledWith({
        ...createData,
        description: '',
      });
      expect(attractionsRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Attraction');
    });

    it('should use provided description if given', async () => {
      const createData = {
        regionId: 1,
        regionCode: 'moscow',
        imageDesktop: 'desktop.jpg',
        imageMobile: 'mobile.jpg',
        name: 'New Attraction',
        description: 'Custom description',
      };

      jest.spyOn(attractionsRepository, 'create').mockReturnValue({ ...mockAttraction, ...createData });
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue({ ...mockAttraction, ...createData });

      await service.createAttraction(createData);

      expect(attractionsRepository.create).toHaveBeenCalledWith({
        ...createData,
        description: 'Custom description',
      });
    });
  });

  describe('removeAttraction', () => {
    it('should remove the attraction successfully', async () => {
      jest.spyOn(attractionsRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.removeAttraction(1)).resolves.toBeUndefined();
      expect(attractionsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when attraction does not exist', async () => {
      jest.spyOn(attractionsRepository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.removeAttraction(999)).rejects.toThrow(NotFoundException);
      await expect(service.removeAttraction(999)).rejects.toThrow('Attraction with ID 999 not found');
    });
  });

  describe('gptGenerate', () => {
    it('should return early with message if description already exists', async () => {
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(mockAttractionWithDescription);

      const result = await service.gptGenerate(2);

      expect(result.message).toBe('Description already exists');
      expect(result.id).toBe(2);
      expect(yandexGptService.generate).not.toHaveBeenCalled();
    });

    it('should call YandexGPT and update attraction when no description exists', async () => {
      const gptResponse = '{"title":"Кремль","description":"<p>Московский Кремль - древнейшая часть Москвы.</p>"}';
      const updatedAttraction = {
        ...mockAttraction,
        title: 'Кремль',
        description: '<p>Московский Кремль - древнейшая часть Москвы.</p>',
      };

      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(mockAttraction);
      jest.spyOn(yandexGptService, 'generate').mockResolvedValue(gptResponse);
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue(updatedAttraction as Attraction);

      const result = await service.gptGenerate(1);

      expect(yandexGptService.generate).toHaveBeenCalled();
      expect(attractionsRepository.save).toHaveBeenCalled();
      expect(result.message).toBe('Description generated successfully');
    });

    it('should throw NotFoundException when attraction does not exist', async () => {
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.gptGenerate(999)).rejects.toThrow(NotFoundException);
    });

    it('should return early if description is only whitespace', async () => {
      const attractionWithWhitespace = { ...mockAttraction, description: '   ' };
      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(attractionWithWhitespace);

      const gptResponse = '{"title":"Test","description":"<p>Test</p>"}';
      jest.spyOn(yandexGptService, 'generate').mockResolvedValue(gptResponse);
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue({ ...attractionWithWhitespace, description: '<p>Test</p>' } as Attraction);

      const result = await service.gptGenerate(1);

      expect(yandexGptService.generate).toHaveBeenCalled();
      expect(result.message).toBe('Description generated successfully');
    });

    it('should use attraction name as fallback title when GPT returns empty title', async () => {
      const gptResponse = '{"title":"","description":"<p>Some description</p>"}';
      const updatedAttraction = {
        ...mockAttraction,
        title: mockAttraction.name,
        description: '<p>Some description</p>',
      };

      jest.spyOn(attractionsRepository, 'findOne').mockResolvedValue(mockAttraction);
      jest.spyOn(yandexGptService, 'generate').mockResolvedValue(gptResponse);
      jest.spyOn(attractionsRepository, 'save').mockResolvedValue(updatedAttraction as Attraction);

      await service.gptGenerate(1);

      const saveCall = (attractionsRepository.save as jest.Mock).mock.calls[0][0];
      expect(saveCall.title).toBe(mockAttraction.name);
    });
  });
});
