import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatBox } from "./Chatbox.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() =>  ChatBox, chatbox => chatbox.messages, { onDelete: 'CASCADE' })
    chatbox: ChatBox

    @ManyToOne(() => User, user => user.messages)
    user: User
}