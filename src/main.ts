import { NestFactory } from '@nestjs/core';
import { GameModule } from 'src/game/game.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(GameModule);
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
