import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import fastifyHelmet from '@fastify/helmet';
import { MainModule } from '~/main.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter({
      logger: {
        level: process.env.APP_DEBUG === 'true' ? 'debug' : 'warn',
      },
      trustProxy: true,
      disableRequestLogging: true,
    }),
    {
      cors: true,
      logger:
        process.env.APP_DEBUG === 'true'
          ? ['log', 'error', 'warn', 'debug', 'verbose']
          : ['log', 'error', 'warn'],
    },
  );

  app.enableShutdownHooks();

  await app.register(fastifyHelmet, {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`, 'unpkg.com'],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
          'unpkg.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [
          `'self'`,
          `https: 'unsafe-inline'`,
          `cdn.jsdelivr.net`,
          `'unsafe-eval'`,
        ],
      },
    },
  });

  await app.listen(process.env.APP_PORT || 3042, '0.0.0.0');

  Logger.log(
    `🚀 API application is running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
}

bootstrap();
