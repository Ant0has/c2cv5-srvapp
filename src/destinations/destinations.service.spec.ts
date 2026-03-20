import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './destination.entity';
import { CreateDestinationDto } from './create-destination.dto';
import { UpdateDestinationDto } from './update-destination.dto';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let repository: Record<string, jest.Mock>;

  const mockDestination: Partial<Destination> = {
    id: 1,
    hubId: 1,
    name: 'Красная Поляна',
    slug: 'krasnaya-polyana',
    title: 'Трансфер в Красную Поляну',
    subtitle: 'Комфортный трансфер',
    fromCity: 'Сочи',
    toCity: 'Красная Поляна',
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    hub: { id: 1, slug: 'gornolyzhka' } as any,
  };

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockDestination]),
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        {
          provide: getRepositoryToken(Destination),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);

    // Reset mocks between tests
    jest.clearAllMocks();
    // Re-apply chainable returns after clearAllMocks
    mockQueryBuilder.select.mockReturnThis();
    mockQueryBuilder.addSelect.mockReturnThis();
    mockQueryBuilder.leftJoinAndSelect.mockReturnThis();
    mockQueryBuilder.leftJoin.mockReturnThis();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.andWhere.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();
    mockQueryBuilder.getMany.mockResolvedValue([mockDestination]);
    repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── create ──────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a destination', async () => {
      const dto: CreateDestinationDto = {
        hubId: 1,
        name: 'Красная Поляна',
        slug: 'krasnaya-polyana',
        title: 'Трансфер в Красную Поляну',
      };

      repository.create.mockReturnValue(mockDestination);
      repository.save.mockResolvedValue(mockDestination);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockDestination);
      expect(result).toEqual(mockDestination);
    });
  });

  // ── findAll ─────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return active destinations without hub filter', async () => {
      const result = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('destination');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'destination.hub',
        'hub',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'destination.isActive = :isActive',
        { isActive: true },
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'destination.sortOrder',
        'ASC',
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockDestination]);
    });

    it('should filter by hub slug when hub parameter is provided', async () => {
      const result = await service.findAll('gornolyzhka');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'hub.slug = :hubSlug',
        { hubSlug: 'gornolyzhka' },
      );
      expect(result).toEqual([mockDestination]);
    });

    it('should not apply hub filter when hub is undefined', async () => {
      await service.findAll(undefined);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should not apply hub filter when hub is empty string', async () => {
      await service.findAll('');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  // ── findOne ─────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return destination by id', async () => {
      repository.findOne.mockResolvedValue(mockDestination);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['hub'],
      });
      expect(result).toEqual(mockDestination);
    });

    it('should throw NotFoundException when destination not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Destination with ID 999 not found',
      );
    });
  });

  // ── findBySlug ──────────────────────────────────────────────────────

  describe('findBySlug', () => {
    it('should return destination by slug', async () => {
      repository.findOne.mockResolvedValue(mockDestination);

      const result = await service.findBySlug('krasnaya-polyana');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug: 'krasnaya-polyana' },
        relations: ['hub'],
      });
      expect(result).toEqual(mockDestination);
    });

    it('should throw NotFoundException when slug not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(
        'Destination with slug "nonexistent" not found',
      );
    });
  });

  // ── search ──────────────────────────────────────────────────────────

  describe('search', () => {
    it('should search destinations by query with LIKE across multiple fields', async () => {
      repository.find.mockResolvedValue([mockDestination]);

      const result = await service.search('Сочи');

      expect(repository.find).toHaveBeenCalledWith({
        where: [
          { name: expect.objectContaining({ _value: '%Сочи%' }), isActive: true },
          { fromCity: expect.objectContaining({ _value: '%Сочи%' }), isActive: true },
          { toCity: expect.objectContaining({ _value: '%Сочи%' }), isActive: true },
          { title: expect.objectContaining({ _value: '%Сочи%' }), isActive: true },
          { subtitle: expect.objectContaining({ _value: '%Сочи%' }), isActive: true },
        ],
        relations: ['hub'],
        take: 20,
      });
      expect(result).toEqual([mockDestination]);
    });

    it('should limit results to 20', async () => {
      repository.find.mockResolvedValue([]);

      await service.search('test');

      const callArgs = repository.find.mock.calls[0][0];
      expect(callArgs.take).toBe(20);
    });

    it('should return empty array when no matches', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.search('несуществующий');

      expect(result).toEqual([]);
    });
  });

  // ── getFeatured ─────────────────────────────────────────────────────

  describe('getFeatured', () => {
    it('should return featured active destinations', async () => {
      const featuredDestination = { ...mockDestination, isFeatured: true };
      repository.find.mockResolvedValue([featuredDestination]);

      const result = await service.getFeatured();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isFeatured: true, isActive: true },
        relations: ['hub'],
        order: { sortOrder: 'ASC' },
        take: 10,
      });
      expect(result).toEqual([featuredDestination]);
    });

    it('should limit results to 10', async () => {
      repository.find.mockResolvedValue([]);

      await service.getFeatured();

      const callArgs = repository.find.mock.calls[0][0];
      expect(callArgs.take).toBe(10);
    });

    it('should return empty array when no featured destinations', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.getFeatured();

      expect(result).toEqual([]);
    });
  });

  // ── update ──────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the destination', async () => {
      const updateDto: UpdateDestinationDto = { title: 'Updated Title' };
      const updatedDestination = { ...mockDestination, title: 'Updated Title' };

      repository.findOne.mockResolvedValue(mockDestination);
      repository.save.mockResolvedValue(updatedDestination);

      const result = await service.update(1, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['hub'],
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedDestination);
    });

    it('should throw NotFoundException when destination to update not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should merge dto fields into existing destination', async () => {
      const updateDto: UpdateDestinationDto = {
        name: 'New Name',
        sortOrder: 5,
      };

      repository.findOne.mockResolvedValue({ ...mockDestination });
      repository.save.mockImplementation(async (entity: any) => entity);

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('New Name');
      expect(result.sortOrder).toBe(5);
    });
  });

  // ── remove ──────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete the destination', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when destination to delete not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Destination with ID 999 not found',
      );
    });

    it('should return void on successful deletion', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(1);

      expect(result).toBeUndefined();
    });
  });
});
