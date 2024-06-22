import { Brand } from 'src/brands/entities/Brand.entity';
import { Family } from 'src/families/entities/Family.entity';
import { File } from 'src/files/entities/File.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(() => Brand, (brand) => brand.games)
  brand: Brand;

  @ManyToOne(() => Family, (family) => family.games)
  family: Family;

  @ManyToMany(() => File, (file) => file.games)
  @JoinTable()
  files: File[];
}
