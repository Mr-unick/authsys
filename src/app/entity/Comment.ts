import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import type { Users } from './Users';
import type { Leads } from './Leads';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column({ type: 'timestamp', nullable: true })
    created_at: Date;

    @Column({ nullable: true, type: 'varchar', length: 1000 })
    url: string;

    @Column({ nullable: true })
    type: string;

    @ManyToOne('Leads', 'comments')
    lead: Leads;

    @ManyToOne('Users', 'comment')
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: Users;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;
}
