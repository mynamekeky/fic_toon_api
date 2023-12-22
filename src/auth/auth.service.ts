import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(username: string, password: string): Promise<object> {
        const user = await this.prisma.user.findFirst({ where: { username: username } });

        if (!user) {
            throw new NotFoundException(`No user found for username: ${username}`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            status: 200,
            accessToken: this.jwtService.sign({ userId: user.id }),
            user
        };
    }
}