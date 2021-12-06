import { Controller, Post, Get, Res, Req, Session } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async authLogin(@Req() req, @Res() res) {
    const data = await this.authService.loginCheck(
      req.body.email,
      req.body.password,
    );
    if (data.success) {
      const tm = 1000 * 60 * 60;
      res.cookie('authToken', data.authUser, {
        maxAge: tm,
        httpOnly: true,
      });
    }
    return res.json(data);
  }

  @Post('logout')
  logout(@Req() req, @Res() res) {
    res.clearCookie('authToken');
    return res.json({});
  }
}
