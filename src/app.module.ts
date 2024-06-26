import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { FamiliesModule } from './families/families.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brands/entities/Brand.entity';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { Game } from './games/entities/Game.entity';
import { Family } from './families/entities/Family.entity';
import { FilesModule } from './files/files.module';
import { File } from './files/entities/File.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Game, Brand, Family, File],
      synchronize: true,
    }),
    BrandsModule,
    FamiliesModule,
    GamesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
