import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMeta } from './regions/post-meta.entity';
import { Posts } from './regions/posts.entity';
import { RegionsModule } from './regions/regions.module';
import { Regions } from './regions/regions.entity';
import { Routes } from './routes/routes.entity';
import { RoutesModule } from './routes/routes.module';
import { MailModule } from './mail/mail.module';
import { AttractionsModule } from './attractions/attractions.module';
import { AttractionImage } from './attractions/attraction-image.entity';
import { Attraction } from './attractions/attraction.entity';
import { RouteReview } from './route-reviews/route-review.entity';
import { RouteReviewsModule } from './route-reviews/route-reviews.module';
import { Destination } from './destinations/destination.entity';
import { Hub } from './hubs/hub.entity';
import { DestinationsModule } from './destinations/destinations.module';
import { HubsModule } from './hubs/hubs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigModule глобальным
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('TYPE') === 'development') {
          return {
            type: configService.get<string>('DB_TYPE') as any,
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [Posts, PostMeta, AttractionImage, Destination, Hub],
            synchronize: false, // Внимание: используйте только в разработке!
            logging: true,
          };
        } else {
          return {
            type: configService.get<string>('DB_TYPE') as any,
            socketPath: configService.get<string>('DB_HOST') as any,
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            entities: [Posts, PostMeta, Regions, Routes, AttractionImage, Attraction, RouteReview, Destination, Hub],
            synchronize: false, // Внимание: используйте только в разработке!
            // logging: true,
          };
        }
      },
    }),
    RegionsModule,
    RoutesModule,
    MailModule,
    AttractionsModule,
    RouteReviewsModule,
    DestinationsModule,
    HubsModule,
  ],
})
export class AppModule {}
