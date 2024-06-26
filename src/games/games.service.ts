import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Game } from './entities/Game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FamiliesService } from 'src/families/families.service';
import { BrandsService } from 'src/brands/brands.service';
import { FilesService } from 'src/files/files.service';
import { File } from 'src/files/entities/File.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    private readonly familyService: FamiliesService,
    private readonly brandService: BrandsService,
    private readonly filesService: FilesService,
    private dataSource: DataSource,
  ) {}

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({ where: { deleted: false } });
  }

  async getGame(id: number): Promise<Game> {
    await this.findGame(id);
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.brand', 'brand')
      .leftJoinAndSelect('game.family', 'family')
      .leftJoinAndSelect('game.files', 'file', 'file.deleted = false')
      .where('game.id = :id', { id })
      .getOne();
  }

  async createGame(
    game: CreateGameDto,
    files: Express.Multer.File[],
  ): Promise<Game> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { familyId, brandId, ...rest } = game;
      const family = await this.familyService.findFamily(familyId);
      const brand = await this.brandService.findBrand(brandId);
      const filesToAdd = await Promise.all(
        this.filesService.createFiles(files, queryRunner),
      );
      if (filesToAdd.length) {
        filesToAdd[0].is_main = true;
      }
      const gameToSave = this.gameRepository.create({
        ...rest,
        family,
        brand,
        files: filesToAdd,
      });
      const newGame = await queryRunner.manager.save(Game, gameToSave);
      await queryRunner.commitTransaction();
      return newGame;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        error.message ? error.message : 'Error al guardar juego',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateGame(
    id: number,
    game: UpdateGameDto,
    files: Express.Multer.File[],
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameToUpdate = await this.getGame(id);
      const { familyId, brandId, filesToDelete, mainImage, ...rest } = game;
      const family = await this.familyService.findFamily(familyId);
      const brand = await this.brandService.findBrand(brandId);
      let filesToAdd: File[] = [];
      if (files) {
        filesToAdd = await Promise.all(
          this.filesService.createFiles(files, queryRunner),
        );
      }
      const filesToRemove: number[] = JSON.parse(filesToDelete.toString());
      if (filesToRemove.length) {
        filesToRemove.forEach(async (fileId) => {
          await this.fileRepository
            .createQueryBuilder('file', queryRunner)
            .update(File)
            .set({ deleted: true })
            .where({ id: fileId })
            .execute();
        });
      }

      if (gameToUpdate.files) {
        gameToUpdate.files.forEach(async (file) => {
          await this.fileRepository
            .createQueryBuilder('file', queryRunner)
            .update(File)
            .set({ is_main: false })
            .where({ id: file.id, deleted: false })
            .execute();
        });
      }

      if (filesToAdd.length && !mainImage) {
        filesToAdd[0].is_main = true;
      } else if (mainImage) {
        await this.fileRepository
          .createQueryBuilder('file', queryRunner)
          .update(File)
          .set({ is_main: true })
          .where({ id: mainImage })
          .execute();
      }

      const gameUpdated = {
        ...gameToUpdate,
        ...rest,
        family,
        brand,
        files: [...gameToUpdate.files, ...filesToAdd],
      };

      await queryRunner.manager.save(Game, gameUpdated);
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al editar juego');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteGame(id: number): Promise<UpdateResult> {
    await this.findGame(id);
    return this.gameRepository.update({ id }, { deleted: true });
  }

  async findGame(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id, deleted: false },
    });

    if (!game) {
      throw new NotFoundException('Game Not Found');
    }

    return game;
  }
}
