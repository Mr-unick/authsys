import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, DeleteDateColumn } from 'typeorm';
import type { Roles } from './Roles';
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

  @ManyToMany('Roles', 'permissions')
  role: Roles[];

  @ManyToOne(() => Policy, policy => policy.permissions)
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
