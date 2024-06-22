import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/Brand.entity';
import { Game } from 'src/games/entities/Game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Game])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
