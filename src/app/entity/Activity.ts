import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Users } from './Users';
import { Leads } from './Leads';


export enum ActivityType {
    COMMENT = 'Comment',
    STAGE_CHANGE = 'Stage Change',
    EDIT = 'Edit',
    DELETE = 'Delete',
    UPDATE = 'Update',
    LOGIN = 'Login',
    LOGOUT = 'Logout',
    ASSIGN = 'Assign'
}

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ActivityType })
    type: ActivityType;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    timestamp: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Users, (user) => user.activities)
    user: Users | null;

    @ManyToOne(() => Leads, lead => lead.activities, { onDelete: 'CASCADE', nullable: true })
    lead: Leads | null; 
}
