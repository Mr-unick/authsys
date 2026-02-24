import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, DeleteDateColumn, Unique } from 'typeorm';
import type { Business } from './Business';
import type { Leads } from './Leads';
import { StageChangeHistory } from './StageChangeHistory';

@Entity("lead_stages")
@Unique(['stage_name', 'business'])
export class LeadStages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stage_name: string;

  @Column()
  colour: string;

  @Column({ nullable: true })
  discription: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne('Business', 'leadStages', { nullable: true })
  @JoinColumn({ name: 'buisnessId' })
  business: Business;

  @OneToMany('Leads', 'stage', { nullable: true })
  leads: Leads[];

  @OneToMany(() => StageChangeHistory, stageChangeHistory => stageChangeHistory.stage, { nullable: true })
  stageChangeHistory: StageChangeHistory[];
}
