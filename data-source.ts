// // data-source.ts
// import { DataSource } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { PostMeta } from './src/regions/post-meta.entity';
// import { Posts } from './src/regions/posts.entity';
// import { Regions } from './src/regions/regions.entity';
// import { Routes } from './src/regions/routes.entity';
// import { AttractionImage } from './src/attractions/attraction-image.entity';

// export default new DataSource({
//   type: 'mysql',
//   host: configService.get<string>('DB_HOST'),
//   port: configService.get<number>('DB_PORT'),
//   username: configService.get<string>('DB_USERNAME'),
//   password: configService.get<string>('DB_PASSWORD'),
//   database: configService.get<string>('DB_DATABASE'),
//   entities: [Posts, PostMeta, Regions, Routes, AttractionImage],
//   migrations: ['src/migrations/*.ts'],
//   synchronize: false,
// });

// data-source.ts
const { DataSource } = require('typeorm');

module.exports = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'resam2171',
  database: process.env.DB_DATABASE || 'city',
  entities: [
    'src/regions/post-meta.entity.ts',
    'src/regions/posts.entity.ts',
    'src/regions/regions.entity.ts',
    'src/regions/routes.entity.ts',
    'src/attractions/attraction-image.entity.ts',
    'src/attractions/attraction.entity.ts'
  ],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});