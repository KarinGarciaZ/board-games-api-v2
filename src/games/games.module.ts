import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/Game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brands/entities/Brand.entity';
import { Family } from 'src/families/entities/Family.entity';
import { BrandsService } from 'src/brands/brands.service';
import { FamiliesService } from 'src/families/families.service';
import { MulterModule } from '@nestjs/platform-express';
import { File } from 'src/files/entities/File.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Brand, Family, File]),
    MulterModule.register({
      dest: 'uploads/',
    }),
  ],
  providers: [GamesService, BrandsService, FamiliesService],
  controllers: [GamesController],
})
export class GamesModule {}
