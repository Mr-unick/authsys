import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, DeleteDateColumn } from "typeorm";
import type { Business } from "./Business";
import type { Roles } from "./Roles";

@Entity('branch')
export class Branch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    branch_code: string;

    @Column()
    location: string;

    @Column()
    number: string;

    @Column()
    address: string;

    @Column()
    state: string;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column()
    pincode: string;

    @Column()
    discription: string;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @ManyToOne('Business', 'branches')
    @JoinColumn({ name: 'buisnessId', referencedColumnName: 'id' })
    buisness: Business;

    @OneToMany('Roles', 'branch', { nullable: true })
    roles: Roles[];
}
