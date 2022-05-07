import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { GameStates } from 'src/common/game-states.enum';
import { FileService } from 'src/utils/fileService.service';
import { User, UserRoles } from 'src/users/schemas/user.schema';

describe('GameController', () => {
  let controller: GameController;
  afterEach(() => {
    jest.clearAllMocks();
  });
  const StartGameMock = {
    number: 4,
    token: 'ecd0f665-1540-4775-b409-19e5dc08bb66',
  };
  const GuessResponseMock = {
    statusLetter: [
      { letter: 't', value: 1 },
      { letter: 'o', value: 1 },
      { letter: 't', value: 1 },
      { letter: 'a', value: 1 },
      { letter: 'l', value: 1 },
    ],
    intent: 'total',
  };

  const GameServiceMock = {
    start: jest.fn(),
    getWord: jest.fn(),
    guess: jest.fn(),
    counter: 1,
    setGamesTokensPlayed: jest.fn(),
    setGamesTokensWon: jest.fn(),
  };
  const mockUser = {
    _id: '61cd5ekcsv66945x1wc',
    email: 'user1@mail.com',
    name: 'namefake',
    role: UserRoles.USER,
  };
  const FileServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameController,
        {
          provide: GameService,
          useValue: GameServiceMock,
        },
        {
          provide: FileService,
          useValue: FileServiceMock,
        },
      ],
    }).compile();
    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('start function', () => {
    beforeAll(() => {
      GameServiceMock.start.mockReturnValue(StartGameMock);
    });
    it('should call start method', () => {
      const result = controller.start();
      expect(result).toEqual(StartGameMock);
    });
  });

  describe('getWord function', () => {
    const secretWord = 'solve';
    beforeAll(() => {
      GameServiceMock.getWord.mockReturnValue(secretWord);
    });
    it('should call getWord method', () => {
      const result = controller.getWord(StartGameMock.token);
      expect(result).toEqual(secretWord);
    });
  });

  describe('guess function', () => {
    const secret = 'total';
    it('should call guess method and return a Game response win when guess word is correct', () => {
      const guess = 'total';
      const GameResponseWinMock = {
        statusGame: GameStates.Win,
        intent: guess,
        statusLetter: GuessResponseMock.statusLetter,
        secretWord: secret,
        counter: 1,
        gamesWon: 1,
      };
      GameServiceMock.guess.mockReturnValue(GuessResponseMock);
      GameServiceMock.counter;
      const result = controller.guess(
        StartGameMock.token,
        guess,
        mockUser as User,
      );
      expect(result).toEqual(GameResponseWinMock);
    });

    it('should call guess method and return a Game response try-again when guess word is incorrect', () => {
      const guess = 'tamic';
      const GuessResponseMock = {
        statusLetter: [
          { letter: 't', value: 1 },
          { letter: 'a', value: 2 },
          { letter: 'm', value: 3 },
          { letter: 'i', value: 3 },
          { letter: 'c', value: 3 },
        ],
        intent: 'total',
      };
      const GameResponseTryAgainMock = {
        statusGame: GameStates.TryAgain,
        intent: guess,
        statusLetter: GuessResponseMock.statusLetter,
        counter: 1,
      };
      GameServiceMock.guess.mockReturnValue(GuessResponseMock);
      GameServiceMock.counter;
      const result = controller.guess(
        StartGameMock.token,
        guess,
        mockUser as User,
      );
      expect(result).toEqual(GameResponseTryAgainMock);
    });
  });
});
