import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'families' })
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: false })
  deleted: boolean;
}
