import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brands/entities/Brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Brand])],
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
