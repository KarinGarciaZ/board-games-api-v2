import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Game } from './entities/Game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { BrandsService } from 'src/brands/brands.service';
import { FamiliesService } from 'src/families/families.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private readonly brandsService: BrandsService,
    private readonly familiesService: FamiliesService,
  ) {}

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({ where: { deleted: false } });
  }

  getGame(id: number): Promise<Game> {
    return this.findGame(id);
  }

  async createGame(): Promise<Game> {
    const brand = await this.brandsService.findBrand(2);
    const family = await this.familiesService.findFamily(2);
    const g = {
      name: 'bhjsjd',
      description: 'sdffsd',
      age_recommended: 23,
      play_time: 32,
      min_players: 2,
      max_players: 4,
      brand,
      family,
    };
    const gameToSave = this.gameRepository.create(g);
    return this.gameRepository.save(gameToSave);
  }

  async updateGame(id: number, game: UpdateGameDto): Promise<UpdateResult> {
    await this.findGame(id);
    return this.gameRepository.update({ id }, game);
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
