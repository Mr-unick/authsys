import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';


import { Business } from './Business';
import { AreaOfOperation } from './AreaOfOperation';
import { StageChangeHistory } from './StageChangeHistory';
import { LeadStages } from './LeadStages';
import { Users } from './Users';
import { Comment } from './Comment';

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

  @Column({nullable:true})
  address: string;

  @Column({ nullable: true ,default:'active'})
  status: string;

  @Column({nullable:true})
  second_phone: string;

  @Column({ nullable: true })
  lead_source: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToMany(() => Users, (users) => users.leads, { nullable: true })
  @JoinTable({ 
    name: 'lead_users', 
    joinColumn: { name: 'lead_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' } 
  })
  users: Users[];

  @OneToMany(() => StageChangeHistory, (history) => history.lead, { nullable: true })
  history: StageChangeHistory[];

  @ManyToOne(() => LeadStages, stage => stage.leads, { nullable: true })
  @JoinColumn() 
  stage:typeof LeadStages;

  @ManyToOne(() => Business, business => business.id)
  business:typeof Business;

  @OneToMany(() => Comment, comments => comments.lead, { nullable: true })
  comments: typeof Comment

  // @ManyToOne(() => AreaOfOperation, areaOfOperation => areaOfOperation.leads)
  // areaOfOperation: AreaOfOperation;

}
