import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { MessageDto } from '../common/dto/message.dto';
import { AuthDto, RefreshTokenDto, SignOutDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenInfo } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private oauthClient: OAuth2Client;

    constructor(
        @InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailSerivce: MailService,
        private readonly configService: ConfigService
    ) { 
        this.oauthClient = new OAuth2Client(
            this.configService.get("GOOGLE_CLIENT_ID"),
            this.configService.get("GOOGLE_CLIENT_SECRET"),
        );
    }

    private generateRandomPassword() {
        const length = 10; // Length of the password
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to include in the password
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        return password;
    }

    private generateRandomUsername() {
        const prefix = 'sweetuser';
        const randomNumber = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
        const username = prefix + randomNumber.toString();

        return username;
    }

    private async generateTokens(payload: any) {
        return {
            accessToken: await this.jwtService.signAsync(payload, { expiresIn: '15m' }),
            refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '7d' })
        };
    }

    private async generateEmailVerifyingToken(payload: any) {
        return {
            verifyToken: await this.jwtService.signAsync(payload, { expiresIn: '15m' })
        }
    }

    private async storeRefreshToken(token: string): Promise<void> {
        const newToken = this.refreshTokenRepository.create({ token })
        await this.refreshTokenRepository.save(newToken)
    }

    private async revokeRefreshToken(token: string): Promise<void> {
        const newToken = await this.refreshTokenRepository.findOneBy({ token })
        await this.refreshTokenRepository.remove(newToken)
    }

    private async checkValidRefreshToken(token: string): Promise<boolean> {
        const wasStored = await this.refreshTokenRepository.findOneBy({ token })
        if (!wasStored) return false

        return true
    }

    private async checkOAuthToken(token: string): Promise<TokenInfo> {
        try {
            return await this.oauthClient.getTokenInfo(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    private async isValidPassword(pass: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(pass, hash);
    }

    async oauth(token: string): Promise<AuthDto> {
        const tokenPayload = await this.checkOAuthToken(token)

        const email = tokenPayload.email
        if (!email) {
            throw new BadRequestException('Cannot get email address')
        }

        const existingAccount = await this.usersService.findOneByEmail(email)
        if (!existingAccount) {
            // generate random info
            const password = this.generateRandomPassword()
            const name = "Sweet User"
            const username = this.generateRandomUsername()

            // create new user
            const user = { email, password, profile: { name, username }, isVerified: true }
            const newUser = await this.usersService.create(user);

            const payload = { sub: newUser.id, username: newUser.profile.username, role: newUser.role };
            const { accessToken, refreshToken } = await this.generateTokens(payload)
            return { accessToken, refreshToken }
        }

        const payload = { sub: existingAccount.id, username: existingAccount.profile.username, role: existingAccount.role };
        const { accessToken, refreshToken } = await this.generateTokens(payload)

        await this.storeRefreshToken(refreshToken)

        return { accessToken, refreshToken }
    }

    async signIn(email: string, pass: string): Promise<AuthDto> {
        const user = await this.usersService.findOneByEmail(email);
        const isValidPassword = await this.isValidPassword(pass, user.password)

        if (!user || !isValidPassword) {
            throw new UnauthorizedException('Username or password is wrong');
        }

        const payload = { sub: user.id, username: user.profile.username, role: user.role };
        const { accessToken, refreshToken } = await this.generateTokens(payload)

        await this.storeRefreshToken(refreshToken)

        return { accessToken, refreshToken }
    }

    async signUp(user: SignUpDto): Promise<AuthDto> {
        const newUser = await this.usersService.create(user);

        const payload = { sub: newUser.id, username: newUser.profile.username, role: newUser.role };
        const { accessToken, refreshToken } = await this.generateTokens(payload)

        await this.storeRefreshToken(refreshToken)

        const { verifyToken } = await this.generateEmailVerifyingToken(payload)
        await this.mailSerivce.sendUserConfirmation(newUser, verifyToken)

        return { accessToken, refreshToken }
    }

    async verifyAccount(token: string): Promise<MessageDto> {
        try {
            const decoded = await this.jwtService.verifyAsync(token)

            const userId = decoded.sub;

            const isVerified = await this.usersService.checkUserIsVerified(userId)
            if (isVerified) {
                throw new ForbiddenException('User was verified !')
            }

            await this.usersService.updateUser(userId, { isVerified: true })

            return { message: 'Verify successfully' }
        } catch (error) {
            throw new UnauthorizedException('Token expired')
        }
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenDto> {
        const isValid = await this.checkValidRefreshToken(refreshToken);
        if (!isValid) throw new UnauthorizedException('Token not valid')

        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken)

            const payload = { sub: decoded.sub, username: decoded.username, role: decoded.role };
            const { accessToken } = await this.generateTokens(payload)

            return { accessToken }
        } catch (error) {
            await this.revokeRefreshToken(refreshToken)
            throw new UnauthorizedException('Token expired')
        }
    }

    async signOut(refreshToken: string): Promise<SignOutDto> {
        await this.revokeRefreshToken(refreshToken)
        return {
            message: "Signed out",
            time: new Date().toISOString()
        }
    }
}
