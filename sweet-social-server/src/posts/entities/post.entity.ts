import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Media } from "./media.entity";
import { PostSettings } from "./post-settings.entity";
import { Like } from "src/reactions/entities/like.entity";
import { Comment } from "src/reactions/entities/comment.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { Saved } from "src/reactions/entities/saved.entity";

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

    @OneToOne(() => PostSettings, settings => settings.post, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    settings: PostSettings

    @OneToMany(() => Like, like => like.post)
    likes: Like[]

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @OneToMany(() => Notification, notification => notification.post)
    notifications: Notification[]

    @OneToMany(() => Saved, saved => saved.post)
    saved: Saved[]
}