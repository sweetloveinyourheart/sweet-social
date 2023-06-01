import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Following {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.following)
    user: User;

    @ManyToOne(() => User, user => user.followers)
    followingUser: User;

    @CreateDateColumn()
    createdAt: Date;
}