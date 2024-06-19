import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsService } from './brands.service';
import { Brand } from './entities/Brand.entity';
import { UpdateResult } from 'typeorm';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  getBrands(): Promise<Brand[]> {
    return this.brandsService.getAllBrands();
  }

  @Get(':id')
  getBrand(@Param('id') id: number): Promise<Brand> {
    return this.brandsService.findBrand(id);
  }

  @Post()
  saveBrand(@Body() body: CreateBrandDto): Promise<Brand> {
    return this.brandsService.createBrand(body);
  }

  @Patch(':id')
  editBrand(
    @Param('id') id: number,
    @Body() body: UpdateBrandDto,
  ): Promise<UpdateResult> {
    return this.brandsService.updateBrand(id, body);
  }

  @Delete(':id')
  deleteBrand(@Param('id') id: number): Promise<UpdateResult> {
    return this.brandsService.deleteBrand(id);
  }
}
