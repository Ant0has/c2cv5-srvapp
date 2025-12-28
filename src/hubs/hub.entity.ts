import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Destination } from '../destinations/destination.entity';

@Entity('hubs')
export class Hub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'seo_title', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ name: 'seo_keywords', type: 'text', nullable: true })
  seoKeywords: string;

  @Column({ name: 'hero_image', type: 'text', nullable: true })
  heroImage: string;

  @Column({ type: 'text', nullable: true })
  features: string; // В БД это text, возможно это JSON строка

  @Column({ type: 'text', nullable: true })
  faq: string; // В БД это text, возможно это JSON строка

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'hero_image_prompt', type: 'text', nullable: true })
  heroImagePrompt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Destination, destination => destination.hub)
  destinations: Destination[];
}