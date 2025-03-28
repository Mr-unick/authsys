import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import {  Users } from './Users';
import { Permissions } from './Permissions';
import { Business } from './Business';
import { Branch } from './Branch';



@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable:true})
  created_at: Date;

  @Column({nullable:true})
  updated_at: Date;

  @OneToMany(type => Users, user => user.role)
  @JoinColumn()
  users:typeof Users[];

  @ManyToOne(type => Business, buisnes => buisnes.role, { nullable: true })
  @JoinColumn({name:'buisnesId',referencedColumnName:'id'})
  buisness:typeof Business;

  @ManyToOne(type => Branch, branch => branch.roles)
  @JoinColumn({name:'branchId',referencedColumnName:'id'})
  branch:typeof Branch;


  @ManyToMany(type => Permissions, permissions => permissions.role)
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
