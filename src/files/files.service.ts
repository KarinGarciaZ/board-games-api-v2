import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/File.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  createFiles(
    files: Express.Multer.File[],
    queryRunner: QueryRunner,
  ): Promise<File>[] {
    try {
      return files.map((file) => {
        const fileToSave = {
          name: file.filename,
          url: `${process.env.FILES_BASE_URL}${file.path}`,
          size: file.size,
          type: file.mimetype,
        };
        const cretedFile = this.fileRepository.create(fileToSave);
        return queryRunner.manager.save(File, cretedFile);
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar archivos');
    }
  }
}
