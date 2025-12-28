import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Destination } from './destination.entity';
import { CreateDestinationDto } from './create-destination.dto';
import { UpdateDestinationDto } from './update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  async create(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    const destination = this.destinationsRepository.create(createDestinationDto);
    return await this.destinationsRepository.save(destination);
  }

  async findAll(hub?: string): Promise<Destination[]> {
    const queryBuilder = this.destinationsRepository
      .createQueryBuilder('destination')
      .leftJoinAndSelect('destination.hub', 'hub')
      .where('destination.isActive = :isActive', { isActive: true });

    if (hub) {
      queryBuilder.andWhere('hub.slug = :hubSlug', { hubSlug: hub });
    }

    queryBuilder.orderBy('destination.sortOrder', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Destination> {
    const destination = await this.destinationsRepository.findOne({
      where: { id },
      relations: ['hub'],
    });

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    return destination;
  }

  async findBySlug(slug: string): Promise<Destination> {
    const destination = await this.destinationsRepository.findOne({
      where: { slug },
      relations: ['hub'],
    });

    if (!destination) {
      throw new NotFoundException(`Destination with slug "${slug}" not found`);
    }

    return destination;
  }

  async search(query: string): Promise<Destination[]> {
    return await this.destinationsRepository.find({
      where: [
        { name: Like(`%${query}%`), isActive: true },
        { fromCity: Like(`%${query}%`), isActive: true },
        { toCity: Like(`%${query}%`), isActive: true },
        { title: Like(`%${query}%`), isActive: true },
        { subtitle: Like(`%${query}%`), isActive: true },
      ],
      relations: ['hub'],
      take: 20,
    });
  }

  async getFeatured(): Promise<Destination[]> {
    return await this.destinationsRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['hub'],
      order: { sortOrder: 'ASC' },
      take: 10,
    });
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination> {
    const destination = await this.findOne(id);
    Object.assign(destination, updateDestinationDto);
    return await this.destinationsRepository.save(destination);
  }

  async remove(id: number): Promise<void> {
    const result = await this.destinationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
  }
}