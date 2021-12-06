import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthSimpleMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    if (!req.headers['authorization']) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'unauthorized exception',
        },
        401,
      );
    }

    const token: string = req.headers['authorization'].replace('Bearer ', '');
    const data = await this.authService.checkAuthToken(token);
    if (!data.success) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'unauthorized exception',
        },
        401,
      );
    }
    req.user = data.user;
    next();
  }
}
