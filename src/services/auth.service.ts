import { AuthUser } from './../interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { PasswordService } from './password.service';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginCheck(email: string, password: string) {
    const u = await this.userRepository.findOne({
      where: { email },
    });

    if (u) {
      const compare = await this.passwordService.comparePassword(
        password,
        u.password,
      );

      if (compare) {
        const payload: AuthUser = {
          id: u.id,
          email: u.email,
          role: u.role,
        };
        const token = this.jwtService.sign(payload);
        payload['token'] = token;
        const { password, ...userRest } = u;
        return { success: true, user: userRest, authUser: payload };
      } else {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  }

  async checkAuth(cookies) {
    if (cookies.authToken) {
      try {
        this.jwtService.verify<{}>(cookies.authToken);
        return { auth: true, user: this.jwtService.decode(cookies.authToken) };
      } catch (err) {
        return { auth: false };
      }
    } else {
      return { auth: false };
    }
  }

  async checkAuthToken(
    token: string,
  ): Promise<{ success: boolean; user?: any }> {
    // console.log(token)
    if (token) {
      try {
        this.jwtService.verify(token);
        return {
          success: true,
          user: this.jwtService.decode(token),
        };
      } catch (err) {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  }
}
