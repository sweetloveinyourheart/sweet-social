import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: false })
    isRead: boolean

    @ManyToOne(() => User, user => user.receivedNotifications)
    recipient: User

    @ManyToOne(() => User, user => user.sentNotifications)
    sender: User

    @ManyToOne(() => Post, post => post.notifications)
    post: Post
}
