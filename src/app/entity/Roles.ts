import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, JoinTable, ManyToMany, DeleteDateColumn } from 'typeorm';
import type { Users } from './Users';
import { Permissions } from './Permissions';
import type { Business } from './Business';
import type { Branch } from './Branch';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany('Users', 'role')
  users: Users[];

  @ManyToOne('Business', 'role', { nullable: true })
  @JoinColumn({ name: 'buisnesId', referencedColumnName: 'id' })
  buisness: Business;

  @ManyToOne('Branch', 'roles', { nullable: true })
  @JoinColumn({ name: 'branchId', referencedColumnName: 'id' })
  branch: Branch;

  @ManyToMany(() => Permissions, permissions => permissions.role, { eager: false })
  @JoinTable({
    name: "role_has_permissions",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id"
    }
  })
  permissions: Permissions[];
}
