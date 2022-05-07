import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StartGame } from 'src/model/start-game.model';
import { GameService } from 'src/game/game.service';
import { States } from 'src/common/states.enum';
import { GameStates } from 'src/common/game-states.enum';
import { FileService } from 'src/utils/fileService.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User, UserRoles } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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
  gamesWon?: number;
}

@Controller()
export class GameController {
  counterGamesWon = 0;
  constructor(
    private readonly gameService: GameService,
    private readonly fileService: FileService,
  ) {}

  @Get('start')
  @UseGuards(AuthGuard())
  start(): StartGame {
    try {
      return this.gameService.start();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('save-file')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRoles.USER)
  saveFile() {
    return this.fileService.saveFile();
  }

  @Get('secret-word/:token')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRoles.USER)
  getWord(@Param('token') token: string): string {
    return this.gameService.getWord(token);
  }

  @Get(':token/guess/:word')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRoles.USER)
  guess(
    @Param('token') token: string,
    @Param('word') word: string,
    @CurrentUser() user: User,
  ): GameResponse {
    let response: {
      statusLetter: StatusLetter[];
      intent: string;
    };

    try {
      response = this.gameService.guess(token, word.trim());

      if (this.gameService.counter > 5) {
        // cuando pierde agregamos el token del game a la lista de gamesTokensPlayed del user
        this.gameService.setGamesTokensPlayed(user, token);
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
        this.counterGamesWon++;
        this.gameService.setGamesTokensWon(user, token);
        this.gameService.setGamesTokensPlayed(user, token);

        return {
          statusGame: GameStates.Win,
          intent: word,
          statusLetter: response.statusLetter,
          counter: this.gameService.counter,
          secretWord: response.intent,
          gamesWon: this.counterGamesWon,
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

  @Get('most-winners')
  @UseGuards(AuthGuard())
  findMostWinnersUsers() {
    return this.gameService.findMostWinnersUsers();
  }

  @Get('user-stats')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRoles.USER)
  findUserGamesWinAndGamesPlayed(@CurrentUser() user: User): Promise<{
    gamesWon: number;
    gamesPlayed: number;
  }> {
    return this.gameService.findUserGamesWinAndGamesPlayed(user);
  }
}
