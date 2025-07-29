import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Leads } from './Leads';
import { LeadStages } from './LeadStages';
import { Users } from './Users';


@Entity('status_change_history')
export class StageChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  changed_at: Date;

  @Column()
  reason: string; 

  @ManyToOne(type => LeadStages, (stage) => stage.stageChangeHistory)
  @JoinColumn({name:'stageId'})
  stage:typeof LeadStages;

  // @ManyToOne(type => Leads, (lead) => lead.history)
  // @JoinColumn({ name: 'lead_id' }) 
  // lead:typeof Leads;

  

@ManyToOne(() => Leads, (lead) => lead.history)
@JoinColumn({ name: 'lead_id' })
lead: Leads;


  @ManyToOne(() => Users, user => user.history)
  @JoinColumn({ name: 'changed_by' })
  changed_by:typeof Users;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
