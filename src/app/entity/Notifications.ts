import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './Users';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: 'unread' })
  status: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(type => Users, user => user.id)
  @JoinColumn()
  user: Users;
}
