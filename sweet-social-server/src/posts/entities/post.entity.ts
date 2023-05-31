import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Media } from "./media.entity";
import { PostSettings } from "./post-settings.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    caption: string

    @Column({ default: 0 })
    likesCount: number

    @Column({ default: 0 })
    commentsCount: number

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User, user => user.posts)
    user: User

    @OneToMany(() => Media, media => media.post, { cascade: true })
    medias: Media[]

    @OneToOne(() => PostSettings, settings => settings.post, { cascade: true })
    @JoinColumn()
    settings: PostSettings
}