import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UpdateResult } from 'typeorm';
import { Game } from './entities/game.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  getGames(): Promise<Game[]> {
    return this.gamesService.getAllGames();
  }

  @Get(':id')
  getGame(@Param('id') id: number): Promise<Game> {
    return this.gamesService.getGame(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  saveGame(
    @Body() body: CreateGameDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.gamesService.createGame(body, files);
  }

  @Patch(':id')
  editGame(
    @Param('id') id: number,
    @Body() body: UpdateGameDto,
  ): Promise<UpdateResult> {
    return this.gamesService.updateGame(id, body);
  }

  @Delete(':id')
  deleteExpansion(@Param('id') id: number): Promise<UpdateResult> {
    return this.gamesService.deleteGame(id);
  }
}
