import { Module } from '@nestjs/common';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { FileService } from 'src/utils/fileService.service';
import { WordleEvaluatorService } from 'src/utils/wordle-evaluator.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, WordleEvaluatorService, FileService, UsersService],
})
export class GameModule {}
