const { DataSource } = require('typeorm');
require('dotenv').config();

module.exports = new DataSource({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'user_c2cv5',
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});
