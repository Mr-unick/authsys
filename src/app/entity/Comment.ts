import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Users } from "./Users";
import { Leads } from "./Leads";



@Entity('comment')
export class Comment{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    comment:string;

    @Column({ type: 'timestamp', nullable: true })
    created_at: Timestamp;

    @ManyToOne(()=>Leads,leads=>leads.comments)
    lead:typeof Leads

    @OneToOne(()=>Users,users=>users.comment)
    @JoinColumn()
    user:typeof Users

}
