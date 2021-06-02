import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const logger = new Logger('App');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3003;

  await app.startAllMicroservicesAsync();

  await app.listen(port);

  const clientUrl = `localhost:${port}/index.html`;
  logger.verbose(`\n\nClient available on ${clientUrl}`);
}
bootstrap();
