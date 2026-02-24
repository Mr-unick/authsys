import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import type { Leads } from './Leads';
import type { LeadStages } from './LeadStages';
import type { Users } from './Users';

@Entity('status_change_history')
export class StageChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  changed_at: Date;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne('LeadStages', 'stageChangeHistory')
  @JoinColumn({ name: 'stageId' })
  stage: LeadStages;

  @ManyToOne('Leads', 'history')
  @JoinColumn({ name: 'lead_id' })
  lead: Leads;

  @ManyToOne('Users', 'history')
  @JoinColumn({ name: 'changed_by' })
  changed_by: Users;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
