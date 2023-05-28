import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Profile } from "./profile.entity"

export enum UserRoles {
    User = "user",
    Admin = "admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ enum: UserRoles, default: UserRoles.User })
    role: UserRoles

    @Column({ default: false })
    is_verified: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @OneToOne(() => Profile, profile => profile.user, { cascade: true })
    @JoinColumn()
    profile: Profile;
}
