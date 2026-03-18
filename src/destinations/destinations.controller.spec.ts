import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

describe('DestinationsController', () => {
  let controller: DestinationsController;
  let service: DestinationsService;

  const mockDestination = {
    id: 1,
    slug: 'krasnaya-polyana',
    name: 'Красная Поляна',
    hub_slug: 'gornolyzhka',
    is_featured: true,
  };

  const mockDestinations = [
    mockDestination,
    { id: 2, slug: 'dombay', name: 'Домбай', hub_slug: 'gornolyzhka', is_featured: false },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [
        {
          provide: DestinationsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDestination),
            findAll: jest.fn().mockResolvedValue(mockDestinations),
            findOne: jest.fn().mockResolvedValue(mockDestination),
            findBySlug: jest.fn().mockResolvedValue(mockDestination),
            search: jest.fn().mockResolvedValue([mockDestination]),
            getFeatured: jest.fn().mockResolvedValue([mockDestination]),
            update: jest.fn().mockResolvedValue({ ...mockDestination, name: 'Updated' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<DestinationsController>(DestinationsController);
    service = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a destination', async () => {
      const dto = { slug: 'krasnaya-polyana', name: 'Красная Поляна' };
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockDestination);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all destinations', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockDestinations);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter by hub slug', async () => {
      await controller.findAll('gornolyzhka');
      expect(service.findAll).toHaveBeenCalledWith('gornolyzhka');
    });
  });

  describe('search', () => {
    it('should search destinations by query', async () => {
      const result = await controller.search('Сочи');
      expect(result).toEqual([mockDestination]);
      expect(service.search).toHaveBeenCalledWith('Сочи');
    });

    it('should return empty array for empty query', async () => {
      const result = await controller.search('');
      expect(result).toEqual([]);
      expect(service.search).not.toHaveBeenCalled();
    });

    it('should return empty array for null-like query', async () => {
      const result = await controller.search(null as any);
      expect(result).toEqual([]);
      expect(service.search).not.toHaveBeenCalled();
    });
  });

  describe('getFeatured', () => {
    it('should return featured destinations', async () => {
      const result = await controller.getFeatured();
      expect(result).toEqual([mockDestination]);
      expect(service.getFeatured).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a destination by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockDestination);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent destination', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Destination not found'),
      );
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a destination by slug', async () => {
      const result = await controller.findBySlug('krasnaya-polyana');
      expect(result).toEqual(mockDestination);
      expect(service.findBySlug).toHaveBeenCalledWith('krasnaya-polyana');
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      jest.spyOn(service, 'findBySlug').mockRejectedValue(
        new NotFoundException('Destination not found'),
      );
      await expect(controller.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a destination', async () => {
      const dto = { name: 'Updated' };
      const result = await controller.update('1', dto as any);
      expect(result).toEqual({ ...mockDestination, name: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a destination', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
