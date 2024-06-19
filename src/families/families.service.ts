import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities/Family.entity';
import { DataSource, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Game } from 'src/games/entities/Game.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private dataSource: DataSource,
  ) {}

  getAllFamilies(): Promise<Family[]> {
    return this.familyRepository.find({ where: { deleted: false } });
  }

  async getFamily(id: number): Promise<Family> {
    await this.findFamily(id);
    return this.familyRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.games', 'game', 'game.deleted = false')
      .where('family.id = :id', { id })
      .getOne();
  }

  createFamily(family: CreateFamilyDto): Promise<Family> {
    const familyToSave = this.familyRepository.create(family);
    return this.familyRepository.save(familyToSave);
  }

  async updateFamily(
    id: number,
    family: UpdateFamilyDto,
  ): Promise<UpdateResult> {
    await this.findFamily(id);
    return this.familyRepository.update({ id }, family);
  }

  async deleteFamily(id: number): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const family = await this.getFamily(id);
      if (family.games.length) {
        await this.gameRepository
          .createQueryBuilder('game', queryRunner)
          .update(Game)
          .set({ deleted: true })
          .where({ family })
          .execute();
      }

      await this.familyRepository
        .createQueryBuilder('family', queryRunner)
        .update(Family)
        .set({ deleted: true })
        .where({ id })
        .execute();
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting the family.');
    } finally {
      await queryRunner.release();
    }
  }

  async findFamily(
    id: number,
    options?: FindOneOptions<Family>,
  ): Promise<Family> {
    const family = await this.familyRepository.findOne({
      where: { id, deleted: false },
      ...options,
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    return family;
  }
}
