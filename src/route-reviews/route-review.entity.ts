import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('route_reviews')
  @Index('idx_route_url', ['route_url'])
  @Index('idx_review_date', ['review_date'])
  export class RouteReview {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 200, nullable: false })
    route_url: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    username: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    city: string;
  
    @Column({ type: 'tinyint', nullable: false, default: 5 })
    rate: number;
  
    @Column({ type: 'varchar', length: 200, nullable: false })
    route_display: string;
  
    @Column({ type: 'text', nullable: false })
    review_text: string;
  
    @Column({ type: 'date', nullable: false })
    review_date: Date;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  }