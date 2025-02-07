import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('super_admin')

export class SuperAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

}
