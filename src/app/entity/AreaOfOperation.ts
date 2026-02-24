import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import type { Business } from './Business';

@Entity('area_of_operations')
export class AreaOfOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  region_code: string;

  @ManyToOne('Business', 'areasOfOperation')
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
