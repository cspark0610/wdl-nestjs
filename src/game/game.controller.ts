import { Controller, Get, Param } from '@nestjs/common';
import { StartGame } from 'src/model/start-game.model';
import { GameService } from 'src/game/game.service';
import { States } from 'src/common/states.enum';
import { GameStates } from 'src/common/game-states.enum';
import { FileService } from 'src/utils/fileService.service';

export interface StatusLetter {
  letter: string;
  value: number;
}
interface GameResponse {
  statusGame: GameStates;
  intent: string;
  statusLetter: StatusLetter[];
  counter: number;
  secretWord?: string;
}

@Controller()
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly fileService: FileService,
  ) {}

  @Get('start')
  start(): StartGame {
    try {
      return this.gameService.start();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('save-file')
  saveFile() {
    return this.fileService.saveFile();
  }

  @Get('secret-word/:token')
  getWord(@Param('token') token: string): string {
    return this.gameService.getWord(token);
  }

  @Get(':token/guess/:word')
  guess(
    @Param('token') token: string,
    @Param('word') word: string,
  ): GameResponse {
    let response: {
      statusLetter: StatusLetter[];
      intent: string;
    };

    try {
      response = this.gameService.guess(token, word.trim());

      if (this.gameService.counter > 5) {
        return {
          statusGame: GameStates.Lose,
          intent: word,
          statusLetter: response.statusLetter,
          counter: this.gameService.counter,
          secretWord: response.intent,
        };
      }
      if (
        response.statusLetter.every(state => state.value == States.Correct) &&
        this.gameService.counter <= 5
      ) {
        return {
          statusGame: GameStates.Win,
          intent: word,
          statusLetter: response.statusLetter,
          counter: this.gameService.counter,
          secretWord: response.intent,
        };
      }
      return {
        statusGame: GameStates.TryAgain,
        intent: word,
        statusLetter: response.statusLetter,
        counter: this.gameService.counter,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
