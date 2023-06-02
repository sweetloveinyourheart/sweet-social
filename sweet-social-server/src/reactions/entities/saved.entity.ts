import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Saved {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Post, post => post.saved, { onDelete: 'CASCADE' })
    post: Post

    @ManyToOne(() => User, user => user.saved)
    user: User
}