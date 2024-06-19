import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ) {}

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({ where: { deleted: false } });
  }

  getGame(id: number): Promise<Game> {
    return this.findGame(id);
  }

  createGame(game: CreateGameDto): Promise<Game> {
    const gameToSave = this.gameRepository.create(game);
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
