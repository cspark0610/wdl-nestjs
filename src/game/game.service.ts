import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import * as words from 'src/files/api-words.json';
import {
  ICompareAndSetState,
  WordleEvaluatorService,
} from 'src/utils/wordle-evaluator.service';
import { StartGame } from 'src/model/start-game.model';
import { StatusLetter } from 'src/game/game.controller';
import { FileService } from 'src/utils/fileService.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/schemas/user.schema';

export interface IGame {
  token: string;
  number: number;
  word: string;
}
@Injectable()
export class GameService {
  private readonly games = new Map<string, IGame>();
  public counter = 0;
  private readonly allWords: string[];
  constructor(
    private readonly wordleEvaluatorService: WordleEvaluatorService,
    private readonly fileService: FileService,
    private readonly usersService: UsersService,
  ) {
    this.writeNewWordDictionary();
    this.allWords = words.answers;
  }

  start(): StartGame {
    const token = v4();
    const randomIdx = Math.floor(Math.random() * this.allWords.length) + 1;
    const secretWord = this.allWords[randomIdx % this.allWords.length];
    // console.log('secretWord', secretWord);
    const game: IGame = {
      token,
      number: randomIdx,
      word: secretWord,
    };
    this.games.set(token, game);
    return new StartGame(randomIdx, token);
  }

  load(token: string): IGame {
    const game: IGame = this.games.get(token);
    if (game === undefined) {
      throw new Error('game id not found');
    }
    return game;
  }

  getWord(token: string): string {
    return this.load(token).word;
  }

  guess(
    token: string,
    guess: string,
  ): {
    statusLetter: StatusLetter[];
    intent: string;
  } {
    this.load(token);
    const secretWord = this.getWord(token);
    if (guess !== '') {
      this.counter++;
      const wordleServiceResult: ICompareAndSetState =
        this.wordleEvaluatorService.compareAndSetState(guess, secretWord);
      return this.formatter(wordleServiceResult);
    }
  }

  async setGamesTokensWon(user: User, token: string): Promise<void> {
    const foundUser: User = await this.usersService.findById(user._id);
    const updateWonToken: string[] = [...foundUser.gamesTokensWon, token];
    await this.usersService.updateById(user._id, {
      gamesTokensWon: updateWonToken,
    });
  }

  async setGamesTokensPlayed(user: User, token: string): Promise<void> {
    const foundUser: User = await this.usersService.findById(user._id);
    const updatePlayedToken: string[] = [...foundUser.gamesTokensPlayed, token];
    await this.usersService.updateById(user._id, {
      gamesTokensPlayed: updatePlayedToken,
    });
  }

  async findMostWinnersUsers(): Promise<User[]> {
    return this.usersService.findMostWinnersUsers();
  }

  async findUserGamesWinAndGamesPlayed(user: User) {
    return this.usersService.findUserGamesWinAndGamesPlayed(user._id);
  }

  private writeNewWordDictionary(): void {
    setInterval(async () => {
      console.log('new axios request executed');
      await this.fileService.saveFile();
    }, 1000 * 60 * 5);
  }

  private formatter(obj: ICompareAndSetState): {
    statusLetter: StatusLetter[];
    intent: string;
  } {
    const res = [];
    for (let i = 0; i < obj.letters.length; i++) {
      res.push({
        letter: obj.letters[i],
        value: obj.values[i],
      });
    }
    return {
      statusLetter: res,
      intent: obj.intent,
    };
  }
}
