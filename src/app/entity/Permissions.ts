import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { Roles } from './Roles';

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  policy:string;

  @Column()
  permission: string;

  @ManyToMany(() => Roles, role => role.permissions)
  @JoinColumn() 
  role:typeof Roles[];
}
