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

  @Column({ name: 'seo_title', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ name: 'seo_keywords', type: 'text', nullable: true })
  seoKeywords: string;

  @Column({ name: 'hero_image', length: 500, nullable: true })
  heroImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'contact_info', type: 'json', nullable: true })
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };

  @Column({ name: 'social_links', type: 'json', nullable: true })
  socialLinks: {
    telegram?: string;
    whatsapp?: string;
    vk?: string;
    instagram?: string;
  };

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Destination, destination => destination.hub)
  destinations: Destination[];
}