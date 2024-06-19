import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './entities/Brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  getAllBrands(): Promise<Brand[]> {
    return this.brandRepository.find({ where: { deleted: false } });
  }

  getBrand(id: number): Promise<Brand> {
    return this.findBrand(id);
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
    await this.findBrand(id);
    return this.brandRepository.update({ id }, { deleted: true });
  }

  async findBrand(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id, deleted: false },
      relations: ['games'],
    });

    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }

    return brand;
  }
}
