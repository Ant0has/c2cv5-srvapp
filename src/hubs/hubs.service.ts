import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from './hub.entity';
import { Destination } from '../destinations/destination.entity';
import { CreateHubDto } from './create-hub.dto';
import { UpdateHubDto } from './update-hub.dto';

@Injectable()
export class HubsService {
  constructor(
    @InjectRepository(Hub)
    private hubsRepository: Repository<Hub>,
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  async create(createHubDto: CreateHubDto): Promise<Hub> {
    const hub = this.hubsRepository.create(createHubDto);
    return await this.hubsRepository.save(hub);
  }

  async findAll(): Promise<Hub[]> {
    return await this.hubsRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Hub> {
    const hub = await this.hubsRepository.findOne({
      where: { id },
      relations: ['destinations'],
    });

    if (!hub) {
      throw new NotFoundException(`Hub with ID ${id} not found`);
    }

    return hub;
  }

  async findBySlug(slug: string): Promise<Hub> {
    const hub = await this.hubsRepository.findOne({
      where: { slug },
      relations: ['destinations'],
    });

    if (!hub) {
      throw new NotFoundException(`Hub with slug "${slug}" not found`);
    }

    return hub;
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    const hubs = await this.hubsRepository.find({
      where: { isActive: true },
      relations: ['destinations'],
    });

    const featuredDestinations = [];
    hubs.forEach(hub => {
      const hubFeaturedDestinations = hub.destinations
        .filter(dest => dest.isFeatured && dest.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, 3); // Берем топ 3 избранных направления из каждого хаба

      featuredDestinations.push(...hubFeaturedDestinations);
    });

    return featuredDestinations.sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 10);
  }

  async update(id: number, updateHubDto: UpdateHubDto): Promise<Hub> {
    const hub = await this.findOne(id);
    Object.assign(hub, updateHubDto);
    return await this.hubsRepository.save(hub);
  }

  async remove(id: number): Promise<void> {
    const result = await this.hubsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hub with ID ${id} not found`);
    }
  }
}