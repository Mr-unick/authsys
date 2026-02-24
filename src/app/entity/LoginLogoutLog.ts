import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import type { Users } from './Users';

@Entity('login_logout_logs')
export class LoginLogoutLog {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  action: string;

  @Column()
  timestamp: Date;

  @Column()
  ip_address: string;

  @Column()
  user_agent: string;

  @ManyToOne('Users', 'loginLogoutLogs')
  @JoinColumn()
  user: Users;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

}
