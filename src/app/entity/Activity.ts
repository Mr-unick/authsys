import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import type { Users } from './Users';
import type { Leads } from './Leads';


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

    @ManyToOne('Users', 'activities')
    user: Users | null;

    @ManyToOne('Leads', 'activities', { onDelete: 'CASCADE', nullable: true })
    lead: Leads | null;
}
