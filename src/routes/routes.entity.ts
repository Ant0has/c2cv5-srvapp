import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('routes')
export class Routes {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'int', nullable: true })
  post_id: number;

  @Column({ type: 'int', nullable: true })
  region_id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'longtext', nullable: true })
  distance: string; // старое текстовое расстояние ( WordPress legacy )

  @Column({ type: 'longtext', nullable: true })
  seo_title: string;

  @Column({ type: 'longtext', nullable: true })
  seo_description: string;

  @Column({ type: 'longtext', nullable: true })
  city_data: string;

  @Column({ type: 'longtext', nullable: true })
  city_seo_data: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_indexable: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  canonical_url: string | null;

  // --- Новые поля после всех SQL-обновлений ---

  @Column({ type: 'int', nullable: true })
  distance_km: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  duration_hours: number | null;

  @Column({ type: 'int', nullable: true })
  price_economy: number | null;

  @Column({ type: 'int', nullable: true })
  price_comfort: number | null;

  @Column({ type: 'int', nullable: true })
  price_comfort_plus: number | null;

  @Column({ type: 'int', nullable: true })
  price_minivan : number | null;

  @Column({ type: 'int', nullable: true })
  price_business: number | null;

  @Column({ type: 'text', nullable: true })
  main_text: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  faq1_q: string | null;

  @Column({ type: 'text', nullable: true })
  faq1_a: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  faq2_q: string | null;

  @Column({ type: 'text', nullable: true })
  faq2_a: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  faq3_q: string | null;

  @Column({ type: 'text', nullable: true })
  faq3_a: string | null;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_whitelist: number;

  @Column({ type: 'timestamp', nullable: true })
  content_updated_at: Date | null;

  // Новые поля, которых не было в entity, но есть в БД
  @Column({ type: 'int', nullable: true })
  price: number | null;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_svo: number;
}
