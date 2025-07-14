import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';



import { Leads } from './Leads';
import { Business } from './Business';

@Entity('area_of_operations')

export class AreaOfOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  region_code: string;

  @Column()
  @ManyToOne(type => Business, business => business.id)
  business_id: number;

  @Column({ type: 'timestamp',nullable: true})
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  // @OneToMany(() => Leads, lead => lead.areaOfOperation)
  // leads: Leads[];

  
}
