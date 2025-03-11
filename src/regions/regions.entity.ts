import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('regions') // Указываем имя таблицы в базе данных
export class Regions {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'int', nullable: true })
  post_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_key: string;

  @Column({ type: 'int', nullable: true })
  meta_id: number;

  @Column({ type: 'text', nullable: true })
  meta_value: string;

  @Column({ type: 'text', nullable: true })
  region_value: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;
}
