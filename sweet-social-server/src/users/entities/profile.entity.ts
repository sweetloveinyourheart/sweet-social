import { Entity, PrimaryGeneratedColumn, Column, OneToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string

    @Column()
    name: string;

    @Column({ nullable: true })
    avatar: string

    @Column({ default: false })
    premium: boolean

    @Column({ nullable: true })
    bio: string;

    @Column({ enum: Gender, nullable: true })
    gender: Gender

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToOne(() => User, user => user.profile)
    user: User;
}
