import { Game } from 'src/games/entities/game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'families' })
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Game, (game) => game.family)
  games: Game[];
}
