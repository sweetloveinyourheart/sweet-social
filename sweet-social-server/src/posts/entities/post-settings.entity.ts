import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostSettings {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: true })
    canComment: boolean

    @Column({ default: true })
    isPublic: boolean

    @Column({ default: true })
    showLikeAndViewCounts: boolean

    @OneToOne(() => Post, post => post.settings)
    post: Post
}