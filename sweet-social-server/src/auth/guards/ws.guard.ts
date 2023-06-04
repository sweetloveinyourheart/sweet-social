import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async canActivate(
        context: any,
    ): Promise<boolean> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];

        try {
            const payload = await this.jwtService.verifyAsync(
                bearerToken,
                { secret: this.configService.get("JWT_SECRET") }
            );

            const user = { id: payload.sub, role: payload.role, username: payload.username }
            context.args[0].user = user

        } catch {
            throw new WsException('Unauthorized !');
        }

        return true
    }
}