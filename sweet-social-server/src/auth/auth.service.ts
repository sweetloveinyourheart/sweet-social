import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailSerivce: MailService
    ) { }

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
        const newToken = this.refreshTokenRepository.create({ token })
        await this.refreshTokenRepository.delete(newToken)
    }

    private async checkValidRefreshToken(token: string): Promise<boolean> {
        const wasStored = await this.refreshTokenRepository.findOneBy({ token })
        if (!wasStored) return false

        return true
    }

    private async isValidPassword(pass: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(pass, hash);
    }

    async signIn(email: string, pass: string): Promise<AuthDto> {
        const user = await this.usersService.findOneByEmail(email);
        const isValidPassword = await this.isValidPassword(pass, user.password)

        if (!user || !isValidPassword) {
            throw new UnauthorizedException('Username or password is wrong');
        }

        const payload = { sub: user.id, role: user.role };
        const { accessToken, refreshToken } = await this.generateTokens(payload)

        await this.storeRefreshToken(refreshToken)

        return { accessToken, refreshToken }
    }

    async signUp(user: SignUpDto): Promise<AuthDto> {
        const newUser = await this.usersService.create(user);

        const payload = { sub: newUser.id, role: newUser.role };
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

            const payload = { sub: decoded.sub, role: decoded.role };
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
