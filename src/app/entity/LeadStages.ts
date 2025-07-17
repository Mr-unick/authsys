import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Business } from './Business';
import {  Leads } from './Leads';
import { StageChangeHistory } from './StageChangeHistory';
import { Users } from './Users';

@Entity("lead_stages")
export class LeadStages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stage_name: string;

  @Column()
  colour :string

  @Column()
  discription:string

 @Column({ type: 'timestamp' ,nullable: true})
   created_at: Date;
 
  @Column({ type: 'timestamp', nullable: true })
   updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Business, business => business.leadStages, { nullable: true })
  @JoinColumn({name:'buisnessId'})
  business:typeof Business;

  @OneToMany(() => Leads, lead => lead.stage, { nullable: true })
  @JoinColumn({name:'lead_Id'})
  leads:typeof Leads[];

  @OneToMany(() => StageChangeHistory, stageChangeHistory => stageChangeHistory.stage, { nullable: true })
  @JoinColumn({name:'stage_Id'})
  stageChangeHistory: StageChangeHistory[];
}
