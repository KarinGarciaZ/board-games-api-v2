import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Family } from './entities/Family.entity';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { UpdateResult } from 'typeorm';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {};

  @Get()
  getFamilies(): Promise<Family[]> {
    return this.familiesService.getAllFamilies();
  };

  @Get(':id')
  getFamily(@Param('id') id: number): Promise<Family> {
    return this.familiesService.getFamily(id);
  };

  @Post()
  saveFamily(@Body() body: CreateFamilyDto): Promise<Family> {
    return this.familiesService.createFamily(body);
  };

  @Patch(':id')
  editFamily(@Param('id') id: number, @Body() body: UpdateFamilyDto): Promise<UpdateResult> {
    return this.familiesService.updateFamily(id, body);
  };

  @Delete(':id')
  deleteFamily(@Param('id') id: number): Promise<UpdateResult> {
    return this.familiesService.deleteFamily(id);
  };
}
