import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

export enum MediaType {
    Image = "image",
    Video = "video"
}

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ enum: MediaType })
    mediaType: MediaType

    @Column()
    mediaUrl: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Post, post => post.medias)
    post: Post

}