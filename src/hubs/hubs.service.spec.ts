import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HubsService } from './hubs.service';
import { Hub } from './hub.entity';
import { Destination } from '../destinations/destination.entity';

describe('HubsService', () => {
  let service: HubsService;
  let hubsRepository: Repository<Hub>;
  let destinationsRepository: Repository<Destination>;

  const mockHub: Partial<Hub> = {
    id: 1,
    name: 'Горнолыжные курорты',
    slug: 'gornolyzhka',
    title: 'Трансфер на горнолыжные курорты',
    description: 'Комфортный трансфер',
    sortOrder: 0,
    isActive: true,
    destinations: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockHub2: Partial<Hub> = {
    id: 2,
    name: 'СВО',
    slug: 'svo',
    title: 'Трансфер в зону СВО',
    sortOrder: 1,
    isActive: true,
  };

  const mockDestination: Partial<Destination> = {
    id: 1,
    name: 'Красная Поляна',
    slug: 'krasnaya-polyana',
    hubId: 1,
    isFeatured: true,
    isActive: true,
    sortOrder: 0,
  };

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HubsService,
        {
          provide: getRepositoryToken(Hub),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Destination),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<HubsService>(HubsService);
    hubsRepository = module.get<Repository<Hub>>(getRepositoryToken(Hub));
    destinationsRepository = module.get<Repository<Destination>>(
      getRepositoryToken(Destination),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a hub', async () => {
      const dto = { name: 'Горнолыжные курорты', slug: 'gornolyzhka' };
      jest.spyOn(hubsRepository, 'create').mockReturnValue(mockHub as Hub);
      jest.spyOn(hubsRepository, 'save').mockResolvedValue(mockHub as Hub);

      const result = await service.create(dto as any);

      expect(hubsRepository.create).toHaveBeenCalledWith(dto);
      expect(hubsRepository.save).toHaveBeenCalledWith(mockHub);
      expect(result).toEqual(mockHub);
    });
  });

  describe('findAll', () => {
    it('should return active hubs ordered by sortOrder', async () => {
      const hubs = [mockHub, mockHub2] as Hub[];
      jest.spyOn(hubsRepository, 'find').mockResolvedValue(hubs);

      const result = await service.findAll();

      expect(hubsRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { sortOrder: 'ASC' },
      });
      expect(result).toEqual(hubs);
    });

    it('should return empty array when no active hubs exist', async () => {
      jest.spyOn(hubsRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a hub with destinations by id', async () => {
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(mockHub as Hub);

      const result = await service.findOne(1);

      expect(hubsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['destinations'],
      });
      expect(result).toEqual(mockHub);
    });

    it('should throw NotFoundException when hub not found', async () => {
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Hub with ID 999 not found',
      );
    });
  });

  describe('findBySlug', () => {
    it('should return a hub with destinations by slug', async () => {
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(mockHub as Hub);
      mockQueryBuilder.getMany.mockResolvedValueOnce([mockDestination]);

      const result = await service.findBySlug('gornolyzhka');

      expect(hubsRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'gornolyzhka' },
      });
      expect(result.destinations).toEqual([mockDestination]);
    });

    it('should throw NotFoundException when slug not found', async () => {
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        'Hub with slug "non-existent" not found',
      );
    });
  });

  describe('getFeaturedDestinations', () => {
    it('should use QueryBuilder to fetch featured destinations', async () => {
      const destinations = [mockDestination] as Destination[];
      mockQueryBuilder.getMany.mockResolvedValue(destinations);

      const result = await service.getFeaturedDestinations();

      expect(destinationsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'dest',
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'dest.hub',
        'hub',
        'hub.isActive = :active',
        { active: true },
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'dest.isFeatured = :featured',
        { featured: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'dest.isActive = :active',
        { active: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'dest.sortOrder',
        'ASC',
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(destinations);
    });

    it('should return empty array when no featured destinations exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getFeaturedDestinations();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update and save the hub', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedHub = { ...mockHub, ...updateDto };
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(mockHub as Hub);
      jest.spyOn(hubsRepository, 'save').mockResolvedValue(updatedHub as Hub);

      const result = await service.update(1, updateDto as any);

      expect(hubsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['destinations'],
      });
      expect(hubsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedHub);
    });

    it('should throw NotFoundException when hub to update not found', async () => {
      jest.spyOn(hubsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Updated' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the hub', async () => {
      jest
        .spyOn(hubsRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(hubsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when hub to delete not found', async () => {
      jest
        .spyOn(hubsRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Hub with ID 999 not found',
      );
    });
  });
});
