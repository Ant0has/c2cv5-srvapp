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

  async findBySlug(slug: string): Promise<Hub & { destinations: Partial<Destination>[] }> {
    const hub = await this.hubsRepository.findOne({
      where: { slug },
    });

    if (!hub) {
      throw new NotFoundException(`Hub with slug "${slug}" not found`);
    }

    // Загружаем destinations с только нужными полями для карточек (экономия ~90% трафика)
    const destinations = await this.destinationsRepository
      .createQueryBuilder('dest')
      .select([
        'dest.id',
        'dest.name',
        'dest.slug',
        'dest.title',
        'dest.subtitle',
        'dest.heroImage',
        'dest.fromCity',
        'dest.toCity',
        'dest.distance',
        'dest.duration',
        'dest.price',
        'dest.features',
        'dest.targetAudience',
        'dest.sortOrder',
        'dest.isFeatured',
        'dest.isActive',
      ])
      .where('dest.hubId = :hubId', { hubId: hub.id })
      .andWhere('dest.isActive = :active', { active: true })
      .orderBy('dest.sortOrder', 'ASC')
      .getMany();

    return { ...hub, destinations };
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    return this.destinationsRepository
      .createQueryBuilder('dest')
      .innerJoin('dest.hub', 'hub', 'hub.isActive = :active', { active: true })
      .where('dest.isFeatured = :featured', { featured: true })
      .andWhere('dest.isActive = :active', { active: true })
      .orderBy('dest.sortOrder', 'ASC')
      .limit(10)
      .getMany();
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