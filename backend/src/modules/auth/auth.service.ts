import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        slug: user.slug,
      }
    };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersService.findByIdWithPassword(userId);
    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Kata sandi saat ini tidak cocok');
    }
    await this.usersService.update(userId, { password: newPass });
    return { success: true, message: 'Kata sandi berhasil diperbarui' };
  }
}
