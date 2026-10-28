import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(registerDto.email);
    if (userExists) {
      throw new ConflictException('Email is already registered');
    }

    const newUser = await this.usersService.create(registerDto);
    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const inputPasswordEncoded = Buffer.from(loginDto.password).toString('base64');

    if (inputPasswordEncoded !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
