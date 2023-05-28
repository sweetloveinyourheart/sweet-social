import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    token: string
}