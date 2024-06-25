import { Module } from '@nestjs/common';
import { File } from './entities/File.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FilesService],
})
export class FilesModule {}
