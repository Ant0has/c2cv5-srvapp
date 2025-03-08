import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'io46w_postmeta' }) // Указываем имя таблицы в базе данных
export class PostMeta {
  @PrimaryGeneratedColumn({ name: 'meta_id' })
  meta_id: number;

  @Column({ type: 'bigint' })
  post_id: number;

  @Column({ type: 'varchar', length: 255 })
  meta_key: string; // varchar(255)

  @Column({ type: 'longtext' })
  meta_value: string; // longtext
}
