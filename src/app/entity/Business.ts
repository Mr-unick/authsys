import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Timestamp, JoinColumn } from 'typeorm';

import { Users } from './Users';
import { SuperAdmin } from './SuperAdmin';
import { AreaOfOperation } from './AreaOfOperation';
import { LeadStages } from './LeadStages';
import { Leads } from './Leads';
import { Exclude } from 'class-transformer';
import { Roles } from './Roles';
import { Branch } from './Branch';

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
  created_at: Timestamp;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Timestamp;

  // @ManyToOne(() => SuperAdmin, superAdmin => superAdmin.businesses)
  // superAdmin: SuperAdmin;

  @OneToMany(type => AreaOfOperation, areaOfOperation => areaOfOperation.business_id, { nullable: true })
  areasOfOperation: AreaOfOperation[];

  @OneToMany(() => LeadStages, leadStage => leadStage.business, { nullable: true })
  @JoinColumn()
  leadStages: typeof LeadStages[];

  @OneToMany(() => Roles, role => role.buisness, { nullable: true })
  @JoinColumn()
  role: typeof Roles[];

  @OneToMany(() => Users, user => user.business, { nullable: true })
  @JoinColumn()
  users: Users[];

  @OneToMany(() => Branch, branch => branch.buisness, { nullable: true })
  @JoinColumn()
  branches: Branch[];

  @OneToMany(() => Leads, lead => lead.business)
  @JoinColumn()
  leads:typeof Leads[];
}
