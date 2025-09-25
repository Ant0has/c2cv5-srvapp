import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: process.env.TYPE === 'development' ? 'io46w_posts' : 'io46w_posts',
}) // Указываем имя таблицы в базе данных
export class Posts {
  @PrimaryGeneratedColumn()
  ID: number; // bigint UN AI PK

  @Column({ type: 'bigint' })
  post_author: number; // bigint UN

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  post_date: Date; // datetime

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  post_date_gmt: Date; // datetime

  @Column({ type: 'longtext' })
  post_content: string; // longtext

  @Column({ type: 'text' })
  post_title: string; // text

  @Column({ type: 'text' })
  post_excerpt: string; // text

  @Column({ type: 'varchar', length: 20 })
  post_status: string; // varchar(20)

  @Column({ type: 'varchar', length: 20 })
  comment_status: string; // varchar(20)

  @Column({ type: 'varchar', length: 20 })
  ping_status: string; // varchar(20)

  @Column({ type: 'varchar', length: 255 })
  post_password: string; // varchar(255)

  @Column({ type: 'varchar', length: 200 })
  post_name: string; // varchar(200)

  @Column({ type: 'text' })
  to_ping: string; // text

  @Column({ type: 'text' })
  pinged: string; // text

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  post_modified: Date; // datetime

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  post_modified_gmt: Date; // datetime

  @Column({ type: 'longtext' })
  post_content_filtered: string; // longtext

  @Column({ type: 'bigint' })
  post_parent: number; // bigint UN

  @Column({ type: 'varchar', length: 255 })
  guid: string; // varchar(255)

  @Column({ type: 'int' })
  menu_order: number; // int

  @Column({ type: 'varchar', length: 20 })
  post_type: string; // varchar(20)

  @Column({ type: 'varchar', length: 100 })
  post_mime_type: string; // varchar(100)
  @Column({ type: 'bigint' })
  comment_count: number; // bigint

  // @BeforeInsert()
  // @BeforeUpdate()
  // setDates() {
  //   const now = new Date();
  //   this.post_date = this.post_date || now; // Устанавливаем текущую дату, если значение отсутствует
  //   this.post_date_gmt = this.post_date_gmt || now; // Устанавливаем текущую дату, если значение отсутствует
  // }
}
