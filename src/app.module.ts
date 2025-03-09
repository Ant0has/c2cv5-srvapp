import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '/run/mysqld/mysqld.sock', // Путь к сокету
      username: 'user_c2c-samopis', // Имя пользователя
      password: 'resam2171', // Пароль
      database: 'user_c2cv5', // Название базы данных
      entities: [
        // Ваши сущности здесь
      ],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
