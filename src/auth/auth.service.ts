import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(RegisterDto: RegisterDto) {
        const userExists = await this.usersService.findByEmail(RegisterDto.email);
        if (userExists) {
            throw new ConflictException('Email is already registred');
        }

        const newUser = await this.usersService.create(RegisterDto);

        const { password, ...result } = newUser
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('invalid credentials ');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken: await this.jwtService.signAsync(payload),
        }
    }
}
