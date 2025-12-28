import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hub } from '../hubs/hub.entity';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hub, hub => hub.destinations)
  @JoinColumn({ name: 'hub_id' })
  hub: Hub;

  @Column({ name: 'hub_id' })
  hubId: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ name: 'seo_title', length: 255, nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription: string;

  @Column({ name: 'seo_keywords', type: 'text', nullable: true })
  seoKeywords: string;

  @Column({ name: 'hero_image', type: 'text', nullable: true })
  heroImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'from_city', length: 255, nullable: true })
  fromCity: string;

  @Column({ name: 'to_city', length: 255, nullable: true })
  toCity: string;

  @Column({ name: 'distance', length: 50, nullable: true })
  distance: string; // В БД это varchar(50), а не int

  @Column({ name: 'duration', length: 50, nullable: true })
  duration: string; // В БД это varchar(50), а не int

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'price_note', type: 'text', nullable: true })
  priceNote: string;

  @Column({ type: 'text', nullable: true })
  features: string;

  @Column({ type: 'text', nullable: true })
  gallery: string;

  @Column({ type: 'text', nullable: true })
  faq: string;

  @Column({ type: 'text', nullable: true })
  tariffs: string;

  @Column({ name: 'target_audience', length: 100, nullable: true })
  targetAudience: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'hero_image_prompt', type: 'text', nullable: true })
  heroImagePrompt: string;

  @Column({ name: 'to_lat', type: 'decimal', precision: 10, scale: 8, nullable: true })
  toLat: number;

  @Column({ name: 'to_lng', type: 'decimal', precision: 11, scale: 8, nullable: true })
  toLng: number;

  @Column({ name: 'weather_data', type: 'json', nullable: true })
  weatherData: any; // В БД это json тип

  @Column({ name: 'weather_updated_at', nullable: true })
  weatherUpdatedAt: Date;

  @Column({ name: 'trip_count_base', default: 0 })
  tripCountBase: number;

  @Column({ name: 'trip_count_date', nullable: true })
  tripCountDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}