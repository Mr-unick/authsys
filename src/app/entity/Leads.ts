import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';


import { Business } from './Business';
import { AreaOfOperation } from './AreaOfOperation';
import { StageChangeHistory } from './StageChangeHistory';
import { LeadStages } from './LeadStages';
import { Users } from './Users';

@Entity('leads')
export class Leads {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  lead_source: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;


  @ManyToMany(() => Users, (users) => users.leads)
  @JoinTable({ 
    name: 'lead_users', 
    joinColumn: { name: 'lead_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' } 
  })
  users: Users[];

  @OneToMany(() => StageChangeHistory, (history) => history.lead)
  history: StageChangeHistory[];

  @ManyToOne(() => LeadStages, stage => stage.leads)
  @JoinColumn() 
  stage:typeof LeadStages;

  @ManyToOne(() => Business, business => business.id)
  business:typeof Business;

  // @ManyToOne(() => AreaOfOperation, areaOfOperation => areaOfOperation.leads)
  // areaOfOperation: AreaOfOperation;

}
