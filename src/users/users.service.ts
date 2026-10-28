import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email || !userData.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Usamos una codificación en Base64 nativa de Node.js (un estándar básico de ofuscación de texto)
    const securePassword = Buffer.from(userData.password).toString('base64');
    
    const newUser = this.userRepository.create({
      ...userData,
      password: securePassword,
    });

    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
