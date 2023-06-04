import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class ChatBox {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    chatboxId: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => Message, message => message.chatbox)
    messages: Message[]

    @ManyToMany(() => User, user => user.chatboxs)
    @JoinTable()
    members: User[]
}