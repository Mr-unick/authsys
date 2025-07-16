import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LeadStages } from './LeadStages';
import { Users } from './Users';
import { Leads } from './Leads'; // regular import is fine for TypeORM
// import type { Leads } from './Leads';

@Entity('status_change_history')
export class StageChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  changed_at: Date;

  @Column()
  reason: string; 

  @ManyToOne(() => Leads, (lead) => lead.history)
  @JoinColumn({ name: 'lead_id' }) 
  lead: Leads;

  @ManyToOne(() => LeadStages, (stage) => stage.stageChangeHistory)
  @JoinColumn({name:'stageId'})
  stage: LeadStages;

  @ManyToOne(() => Users, user => user.history)
  @JoinColumn({ name: 'changed_by' })
  changed_by: Users;
}
