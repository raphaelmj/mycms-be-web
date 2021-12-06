import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/services/services.module';
import { AuthSimpleMiddleware } from 'src/middlewares/auth-simple.middleware';
import { User } from 'src/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ServicesModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSimpleMiddleware)
      .forRoutes({ path: 'api/auth/logout', method: RequestMethod.GET });
  }
}
