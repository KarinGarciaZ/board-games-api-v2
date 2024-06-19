import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/Family.entity';
import { Game } from 'src/games/entities/Game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Family, Game])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
})
export class FamiliesModule {}
