import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { Login } from '../entities/login.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Login) private loginRepository: Repository<Login>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, mobile_number: string, role: UserRole) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      mobile_number,
      role,
    });

    await this.userRepository.save(user);

    const login = this.loginRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    await this.loginRepository.save(login);

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mobile_number: user.mobile_number
      }
    };
  }

  async login(email: string, password: string) {
    // Check in Login table first (where credentials are stored)
    const loginRecord = await this.loginRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role']
    });

    if (!loginRecord) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, loginRecord.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get full user details from User table
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'role', 'mobile_number']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mobile_number: user.mobile_number
      }
    };
  }

  async validateUser(payload: any) {
    return await this.userRepository.findOne({ 
      where: { id: payload.sub } 
    });
  }
}

