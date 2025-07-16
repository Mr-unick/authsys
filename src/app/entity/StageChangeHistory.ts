import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Leads } from './Leads';
import { LeadStages } from './LeadStages';
import { Users } from './Users';
import { type } from 'node:os';
import { Columns } from 'lucide-react';


@Entity('status_change_history')
export class StageChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  changed_at: Date;

  @Column()
  reason: string;

  @ManyToOne(() => require('./LeadStages').LeadStages, (stage) => stage.stageChangeHistory)
  @JoinColumn({ name: 'stageId' })
  stage: any;

  @ManyToOne(() => require('./Leads').Leads, (lead) => lead.history)
  @JoinColumn({ name: 'lead_id' })
  lead: any;

  @ManyToOne(() => require('./Users').Users, (user) => user.history)
  @JoinColumn({ name: 'changed_by' })
  changed_by: any;
}
