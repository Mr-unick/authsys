import { Column, Entity, JoinColumn, Long, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Leads } from "./Leads";



@Entity('comment')

export class Comment{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    comment:string;

    @Column({ type: 'timestamp', nullable: true })
    created_at: Date;

    @Column({nullable:true , type: 'varchar', length: 1000 })
    url :String

    @Column({nullable:true})
    type : String

    @ManyToOne(()=>Leads,leads=>leads.comments)
    lead:typeof Leads

    @ManyToOne(()=>Users,users=>users.comment)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user:typeof Users

}
