import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany } from 'typeorm';

import { Business } from './Business';
import { LoginLogoutLog } from './LoginLogoutLog';
import { Roles } from './Roles';
import { Notification } from './Notifications';
import { StageChangeHistory } from './StageChangeHistory';
import { Leads } from './Leads';

@Entity('users')

export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({nullable:true})
  created_at: Date;

  @Column({nullable:true})
  updated_at: Date;

  @ManyToOne(() => Business, business => business.id)
  @JoinColumn({name:'buisnesId',referencedColumnName:'id'})
  business:typeof Business;

  @ManyToMany(() => Leads, (leads) => leads.users)
  leads: Leads[];

  @ManyToOne(type => Roles, role => role.users)
  @JoinColumn({name:"roleId",referencedColumnName:'id'})
  role:typeof Roles;


  // @OneToMany(() => Notification, notification => notification.user)
  // @JoinColumn()
  // notifications: Notification[];

  // @OneToMany(() => LoginLogoutLog, log => log.user)
  // @JoinColumn()
  // loginLogoutLogs: LoginLogoutLog[];

  // @OneToMany(type => StageChangeHistory,history=> history.changed_by)

  @OneToMany(() => StageChangeHistory, history => history.changed_by)
  // @JoinColumn({name:'id',referencedColumnName:'changed_by'})
  history:typeof StageChangeHistory[];

}
