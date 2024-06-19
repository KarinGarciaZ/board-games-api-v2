import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsOptional()
  @IsNumberString()
  mainImage: number;

  @IsString()
  filesToDelete: number[];
}
