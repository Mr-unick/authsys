import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { Roles } from './Roles';
import { Policy } from './Policy';

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: string;

  @Column()
  description: string;

  @Column()
  action: string;

  @ManyToMany(() => Roles, role => role.permissions)
  @JoinColumn() 
  role:typeof Roles[];

  @ManyToOne(() => Policy, policy => policy.permissions)
  @JoinColumn() 
  policy:typeof Policy[];
}
