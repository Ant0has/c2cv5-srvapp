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
  distance: string;

  @Column({ type: 'longtext', nullable: true })
  seo_title: string;

  @Column({ type: 'longtext', nullable: true })
  seo_description: string;

  @Column({ type: 'longtext', nullable: true })
  city_data: string;

  @Column({ type: 'longtext', nullable: true })
  city_seo_data: string;

  // Новая колонка
  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_indexable: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  canonical_url: string | null;
}
