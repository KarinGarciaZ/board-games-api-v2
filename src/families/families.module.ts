import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/Family.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Family])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
})
export class FamiliesModule {}
