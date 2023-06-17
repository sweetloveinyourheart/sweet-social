import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private configSerivce: ConfigService
    ) { }

    async sendUserConfirmation(user: User, token: string) {
        const clientUrl = this.configSerivce.get("CLIENT_URL")
        const url = `${clientUrl}/auth/verify?token=${token}`;

        try {
            await this.mailerService.sendMail({
                to: user.email,
                // from: '"Support Team" <support@example.com>', // override default from
                subject: 'Welcome to Sweet TV! Confirm your Email',
                template: './confirmation', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    name: user.profile.name,
                    url,
                },
            });
        } catch (error) {
            console.error("Send mail failed")
            return;
        }
    }
}
