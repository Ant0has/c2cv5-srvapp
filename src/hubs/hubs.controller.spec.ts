import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';

describe('HubsController', () => {
  let controller: HubsController;
  let service: HubsService;

  const mockHub = {
    id: 1,
    slug: 'gornolyzhka',
    name: 'Горнолыжные курорты',
    description: 'Трансфер на горнолыжные курорты',
  };

  const mockHubs = [
    mockHub,
    { id: 2, slug: 'svo', name: 'СВО', description: 'Трансфер в зону СВО' },
  ];

  const mockFeaturedDestinations = [
    { id: 1, name: 'Красная Поляна', hub: mockHub },
    { id: 2, name: 'Домбай', hub: mockHub },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubsController],
      providers: [
        {
          provide: HubsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockHub),
            findAll: jest.fn().mockResolvedValue(mockHubs),
            findOne: jest.fn().mockResolvedValue(mockHub),
            findBySlug: jest.fn().mockResolvedValue(mockHub),
            getFeaturedDestinations: jest.fn().mockResolvedValue(mockFeaturedDestinations),
            update: jest.fn().mockResolvedValue({ ...mockHub, name: 'Updated' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<HubsController>(HubsController);
    service = module.get<HubsService>(HubsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a hub', async () => {
      const dto = { slug: 'gornolyzhka', name: 'Горнолыжные курорты' };
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockHub);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all hubs', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockHubs);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getFeaturedDestinations', () => {
    it('should return featured destinations', async () => {
      const result = await controller.getFeaturedDestinations();
      expect(result).toEqual(mockFeaturedDestinations);
      expect(service.getFeaturedDestinations).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a hub by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockHub);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent hub', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new NotFoundException('Hub not found'),
      );
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a hub by slug', async () => {
      const result = await controller.findBySlug('gornolyzhka');
      expect(result).toEqual(mockHub);
      expect(service.findBySlug).toHaveBeenCalledWith('gornolyzhka');
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      jest.spyOn(service, 'findBySlug').mockRejectedValue(
        new NotFoundException('Hub not found'),
      );
      await expect(controller.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a hub', async () => {
      const dto = { name: 'Updated' };
      const result = await controller.update('1', dto as any);
      expect(result).toEqual({ ...mockHub, name: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a hub', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
