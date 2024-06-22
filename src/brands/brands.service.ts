import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Brand } from './entities/Brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, UpdateResult, DataSource } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Game } from 'src/games/entities/Game.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private dataSource: DataSource,
  ) {}

  getAllBrands(): Promise<Brand[]> {
    return this.brandRepository.find({ where: { deleted: false } });
  }

  async getBrand(id: number): Promise<Brand> {
    await this.findBrand(id);
    return this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.games', 'game', 'game.deleted = false')
      .where('brand.id = :id', { id })
      .getOne();
  }

  createBrand(brand: CreateBrandDto): Promise<Brand> {
    const brandToSave = this.brandRepository.create(brand);
    return this.brandRepository.save(brandToSave);
  }

  async updateBrand(id: number, brand: UpdateBrandDto): Promise<UpdateResult> {
    await this.findBrand(id);
    return this.brandRepository.update({ id }, brand);
  }

  async deleteBrand(id: number): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const brandToDelete = await this.getBrand(id);
      if (brandToDelete.games.length) {
        await this.gameRepository
          .createQueryBuilder('game', queryRunner)
          .update(Game)
          .set({ deleted: true })
          .where({ brand: brandToDelete })
          .execute();
      }

      await this.brandRepository
        .createQueryBuilder('brand', queryRunner)
        .update(Brand)
        .set({ deleted: true })
        .where({ id })
        .execute();

      await queryRunner.commitTransaction();
      return;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting the brand');
    } finally {
      await queryRunner.release();
    }
  }

  async findBrand(id: number, options?: FindOneOptions<Brand>): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id, deleted: false },
      ...options,
    });

    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }

    return brand;
  }
}
