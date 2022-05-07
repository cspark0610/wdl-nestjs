import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from 'src/game/game.service';
import { UserRoles } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { FileService } from 'src/utils/fileService.service';
import { WordleEvaluatorService } from 'src/utils/wordle-evaluator.service';

describe('GameService', () => {
  let service: GameService;
  afterEach(() => {
    jest.clearAllMocks();
  });
  const WordleEvaluatorServiceMock = {
    evaluate: jest.fn(),
  };
  const StartGameMock = {
    number: Math.floor(Math.random() * 1500) + 1,
    token: 'ecd0f665-1540-4775-b409-19e5dc08bb66',
  };
  const GameMock = {
    token: 'ecd0f665-1540-4775-b409-19e5dc08bb66',
    number: Math.floor(Math.random() * 1500) + 1,
    word: 'test',
  };
  const mockDictionary = {
    answers: ['abcde'],
  };

  const FileServiceMock = {
    saveFile: jest.fn().mockResolvedValue(mockDictionary),
  };
  const mockUser = {
    _id: '61cd5ekcsv66945x1wc',
    email: 'user1@mail.com',
    name: 'namefake',
    role: UserRoles.USER,
    gamesTokensWon: ['ecd0f665-1540-4775-b409-19e5dc08bb66'],
    gamesTokensPlayed: [],
  };
  const updatedMockUser = {
    ...mockUser,
    gamesTokensWon: ['ecd0f665-1540-4775-b409-19e5dc08bb66'],
  };

  const UsersServiceMock = {
    findById: jest.fn().mockResolvedValue(mockUser),
    updateById: jest.fn().mockResolvedValue(updatedMockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        GameService,
        {
          provide: WordleEvaluatorService,
          useValue: WordleEvaluatorServiceMock,
        },
        {
          provide: FileService,
          useValue: FileServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start function', () => {
    it('should return a StartGame object', () => {
      jest
        .spyOn(service, 'start')
        .mockImplementation()
        .mockReturnValue(StartGameMock);

      const result = service.start();
      expect(result).toEqual(StartGameMock);
    });
  });

  describe('load function', () => {
    const token = 'ecd0f665-1540-4775-b409-19e5dc08bb66';
    it('should return a Game object', () => {
      jest
        .spyOn(service, 'load')
        .mockImplementation()
        .mockReturnValue(GameMock as any);
      const result = service.load(token);
      expect(service.load).toHaveBeenCalledWith(GameMock.token);
      expect(result).toEqual(GameMock);
    });

    it('should throw an error if the token does not correspond to any game', () => {
      jest
        .spyOn(service, 'load')
        .mockImplementation()
        .mockReturnValue(undefined);
      try {
        service.load(token);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('guess function', () => {
    //const secretWord = 'total';
    const IGuessMock = {
      statusLetter: [
        { letter: 't', value: 1 },
        { letter: 'e', value: 3 },
        { letter: 's', value: 3 },
        { letter: 'l', value: 3 },
        { letter: 'a', value: 2 },
      ],
      intent: 'tesla',
    };
    const guess = 'tesla';
    it('should return a IGuess object', () => {
      jest
        .spyOn(service, 'guess')
        .mockImplementation()
        .mockReturnValue(IGuessMock);
      const result = service.guess(GameMock.token, guess);
      expect(service.guess).toHaveBeenCalledWith(GameMock.token, guess);
      expect(result).toEqual(IGuessMock);
    });
  });

  describe('setGamesTokensWon', () => {
    it('should call findById and updateById method', async () => {
      UsersServiceMock.findById();
      UsersServiceMock.updateById();
      await service.setGamesTokensWon(mockUser as any, GameMock.token);
      expect(UsersServiceMock.findById).toHaveBeenCalled();
      expect(UsersServiceMock.updateById).toHaveBeenCalled();
    });
  });
});
