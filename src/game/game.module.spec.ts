import { Test } from '@nestjs/testing';
import { GameModule } from 'src/game/game.module';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { FileService } from 'src/utils/fileService.service';
import { WordleEvaluatorService } from 'src/utils/wordle-evaluator.service';

describe('GameModule', () => {
  it('should compile the GameModule', async () => {
    const module = await Test.createTestingModule({
      imports: [GameModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(GameController)).toBeInstanceOf(GameController);
    expect(module.get(GameService)).toBeInstanceOf(GameService);
    expect(module.get(FileService)).toBeInstanceOf(FileService);
    expect(module.get(WordleEvaluatorService)).toBeInstanceOf(
      WordleEvaluatorService,
    );
  });
});
