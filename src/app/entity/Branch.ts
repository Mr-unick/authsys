import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,JoinColumn } from "typeorm";
import { Business } from "./Business";
import { Roles } from "./Roles";


@Entity('branch')
export class Branch{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string

    @Column()
    email:string

    @Column()
    branch_code:string

    @Column()
    location:string

    @Column()
    number:string

    @Column()
    address:string

    @Column()
    state:string

    @Column()
    district:string

    @Column()
    city:string

    @Column()
    pincode:string

    @Column()
    discription:string

    @ManyToOne(()=>Business,(buisness)=>buisness.branches)
    @JoinColumn()
    buisness:typeof Business

    @OneToMany(() => Roles, (roles) => roles.branch, { nullable: true })
    roles:Roles[]

}
