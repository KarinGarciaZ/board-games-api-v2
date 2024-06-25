import { Game } from 'src/games/entities/Game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  size: number;

  @Column({ default: false })
  is_main: boolean;

  @Column({ default: false })
  deleted: boolean;

  @ManyToMany(() => Game, (game) => game.files)
  games: Game[];
}
