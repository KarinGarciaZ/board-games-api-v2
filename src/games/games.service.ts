import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FamiliesService } from 'src/families/families.service';
import { BrandsService } from 'src/brands/brands.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private readonly familyService: FamiliesService,
    private readonly brandService: BrandsService,
  ) {}

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({ where: { deleted: false } });
  }

  async getGame(id: number): Promise<Game> {
    await this.findGame(id);
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.brand', 'brand')
      .leftJoinAndSelect('game.family', 'family')
      .where('game.id = :id', { id })
      .getOne();
  }

  async createGame(
    game: CreateGameDto,
    files: Express.Multer.File[],
  ): Promise<Game> {
    console.log(files);
    const { familyId, brandId, ...rest } = game;
    const family = await this.familyService.findFamily(familyId);
    const brand = await this.brandService.findBrand(brandId);
    const gameToSave = this.gameRepository.create({
      ...rest,
      family,
      brand,
    });
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
