import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { Permissions } from "./Permissions";



@Entity('policy')
export class Policy {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Permissions, (permissions) => permissions.policy)
    permissions: Permissions[];
    
}
