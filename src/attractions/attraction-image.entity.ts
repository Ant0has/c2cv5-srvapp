import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AttractionImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  region: string;

  @Column()
  name: string;

  @Column()
  size: string;

  @Column()
  path: string;
}
