import { Module } from '@nestjs/common';
import { File } from './entities/File.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
})
export class FilesModule {}
