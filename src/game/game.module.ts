import { Module } from '@nestjs/common';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { FileService } from 'src/utils/fileService.service';
import { WordleEvaluatorService } from 'src/utils/wordle-evaluator.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, WordleEvaluatorService, FileService],
})
export class GameModule {}
