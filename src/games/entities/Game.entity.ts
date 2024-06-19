import { Brand } from 'src/brands/entities/brand.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  age_recommended: number;

  @Column()
  play_time: number;

  @Column()
  min_players: number;

  @Column()
  max_players: number;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ default: 0 })
  rating_voters: number;

  @Column({ default: false })
  deleted: boolean;
}
