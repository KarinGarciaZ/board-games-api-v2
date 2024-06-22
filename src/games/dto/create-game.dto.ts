import { IsNumberString, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumberString()
  age_recommended: number;

  @IsNumberString()
  play_time: number;

  @IsNumberString()
  min_players: number;

  @IsNumberString()
  max_players: number;

  @IsNumberString()
  familyId: number;

  @IsNumberString()
  brandId: number;
}
