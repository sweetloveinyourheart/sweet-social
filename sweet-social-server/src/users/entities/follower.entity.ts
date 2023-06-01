import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Follower {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.followers)
    user: User;

    @ManyToOne(() => User, user => user.following)
    followerUser: User;

    @CreateDateColumn()
    createdAt: Date;
}