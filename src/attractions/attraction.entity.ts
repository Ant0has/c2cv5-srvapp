// src/attractions/attraction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attractions')
export class Attraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'region_id' })
  regionId: number;

  @Column({ name: 'region_code', length: 10 })
  regionCode: string;

  @Column({ name: 'image_desktop', length: 500 })
  imageDesktop: string;

  @Column({ name: 'image_mobile', length: 500 })
  imageMobile: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}