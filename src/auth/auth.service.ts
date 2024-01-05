import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/log-in.dto';
import { WRONG_USERNAME_OR_PASSWORD } from '../constant/error.constant';
import { compare } from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logIn(logInDto: LogInDto) {
    const user = await this.userService.findOne(logInDto.username);
    if (!user) {
      throw new UnauthorizedException({ ...WRONG_USERNAME_OR_PASSWORD });
    }

    const isMatched = await this.verifyPassword(
      logInDto.password,
      user.password,
    );
    if (!isMatched) {
      throw new UnauthorizedException({ ...WRONG_USERNAME_OR_PASSWORD });
    }

    const payload = { ...user.toObject() };
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.createUser(signUpDto);
    return user;
  }

  private verifyPassword(
    passwordToVerify: string,
    hash: string,
  ): Promise<boolean> {
    return compare(passwordToVerify, hash);
  }
}
