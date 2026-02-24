import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, DeleteDateColumn } from 'typeorm';
import type { Business } from './Business';
import { LoginLogoutLog } from './LoginLogoutLog';
import type { Roles } from './Roles';
import { StageChangeHistory } from './StageChangeHistory';
import type { Leads } from './Leads';
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

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt?: Date;

  @ManyToOne('Business', 'users')
  @JoinColumn({ name: 'buisnesId', referencedColumnName: 'id' })
  business: Business;

  @ManyToMany('Leads', 'users', { nullable: true })
  leads: Leads[];

  @ManyToOne('Roles', 'users')
  @JoinColumn({ name: "roleId", referencedColumnName: 'id' })
  role: Roles;

  @OneToMany(() => LoginLogoutLog, log => log.user, { nullable: true })
  loginLogoutLogs: LoginLogoutLog[];

  @OneToMany(() => StageChangeHistory, history => history.changed_by, { nullable: true })
  history: StageChangeHistory[];

  @OneToMany(() => Comment, comment => comment.user, { nullable: true })
  comment: Comment[];

  @OneToMany(() => Activity, activity => activity.user, { nullable: true })
  activities: Activity[];
}
