import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import type { AreaOfOperation } from './AreaOfOperation';
import type { LeadStages } from './LeadStages';
import type { Leads } from './Leads';
import type { Roles } from './Roles';
import type { Branch } from './Branch';
import type { Users } from './Users';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  business_name: string;

  @Column()
  gst_number: string;

  @Column()
  pan_number: string;

  @Column()
  business_address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pin_code: string;

  @Column()
  contact_number: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  owner_name: string;

  @Column()
  owner_contact: string;

  @Column()
  owner_email: string;

  @Column('text', { nullable: true })
  business_description: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany('AreaOfOperation', 'business', { nullable: true })
  areasOfOperation: AreaOfOperation[];

  @OneToMany('LeadStages', 'business', { nullable: true })
  leadStages: LeadStages[];

  @OneToMany('Roles', 'buisness', { nullable: true })
  role: Roles[];

  @OneToMany('Users', 'business', { nullable: true })
  users: Users[];

  @OneToMany('Branch', 'buisness', { nullable: true })
  branches: Branch[];

  @OneToMany('Leads', 'business')
  leads: Leads[];
}
