import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities/Family.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
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
    await this.findFamily(id);
    return this.familyRepository.update({ id }, { deleted: true });
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
