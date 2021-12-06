import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'body-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    etag: false,
    maxAge: 86400000 * 30,
    setHeaders: (res: any, path: string, stat: any) => {
      // res.header('Cache-Control', 'no-store, public, age=15552000');
      // res.header('Pragma', 'no-cache');
    },
  });
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATH', 'OPTION', 'DELETE'],
    allowedHeaders: [
      'X-Requested-With',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Barer',
    ],
    credentials: true,
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('CMS Api')
    .setDescription('cms api')
    .setVersion('1.0')
    .addTag('cms')
    .addBearerAuth()
    .build();
  app.disable('etag');
  app.getHttpAdapter().get('/*', (req, res, next) => {
    if (req.headers.host.match(/^www/) !== null) {
      res.redirect(
        'http://' + req.headers.host.replace(/^www\./, '') + req.url,
      );
    } else {
      next();
    }
  });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
