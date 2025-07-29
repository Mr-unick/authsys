import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, DeleteDateColumn } from 'typeorm';

import { Business } from './Business';
import { LoginLogoutLog } from './LoginLogoutLog';
import { Roles } from './Roles';
import { Notification } from './Notifications';
import { StageChangeHistory } from './StageChangeHistory';
import { Leads } from './Leads';
import { Comment } from './Comment';
import { Activity } from './Activity';

@Entity('users')

export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @Column({ nullable: true  , select: false})
  created_at: Date;

  @Column({ nullable: true  , select: false})
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Business, business => business.id)
  @JoinColumn({ name: 'buisnesId', referencedColumnName: 'id' })
  business:typeof Business;

  @ManyToMany(() => Leads, (leads) => leads.users, { nullable: true })
  leads: Leads[];

  @ManyToOne(type => Roles, role => role.users)
  @JoinColumn({ name: "roleId", referencedColumnName: 'id' })
  role:  Roles;


  // @OneToMany(() => Notification, notification => notification.user)
  // @JoinColumn()
  // notifications: Notification[];

  @OneToMany(() => LoginLogoutLog, log => log.user, { nullable: true })
  @JoinColumn()
  loginLogoutLogs: LoginLogoutLog[];

  // @OneToMany(type => StageChangeHistory,history=> history.changed_by)

  @OneToMany(() => StageChangeHistory, history => history.changed_by, { nullable: true })
  // @JoinColumn({name:'id',referencedColumnName:'changed_by'})
  history: typeof StageChangeHistory[];


  @OneToMany(() => Comment, comment => comment.user, { nullable: true })
  comment: Comment[]


  @OneToMany(() => Activity, activity => activity.user)
  activities: typeof Activity[]

  
}
