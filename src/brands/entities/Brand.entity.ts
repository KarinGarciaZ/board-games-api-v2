import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Game } from 'src/games/entities/Game.entity';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Game, (game) => game.brand)
  games: Game[];
}
