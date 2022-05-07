import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, UserRoles } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { PassportModule } from '@nestjs/passport';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  const signUpDto = {
    email: 'user1@mail.com',
    name: 'namefake',
    password: '12345678',
    role: 'SELLER',
  };
  const mockToken = 'jwtToken';
  const mockUser = {
    _id: '61cd5ekcsv66945x1wc',
    email: 'user1@mail.com',
    name: 'namefake',
    role: UserRoles.USER,
  };

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn().mockImplementationOnce(() => ({
      select: () =>
        jest.fn().mockReturnValue({
          email: signUpDto.email,
          password: signUpDto.password,
        }),
    })),
    signUp: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ token: mockToken })),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret-key',
          signOptions: { expiresIn: '1d' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const loginDto = { email: signUpDto.email, password: signUpDto.password };
    it('should resgister a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('test-hashed-password');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      jest
        .spyOn(service, 'assignJwtToken')
        .mockImplementation()
        .mockResolvedValue(mockToken);

      const result = await service.signUp(signUpDto);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result.token).toEqual(mockToken);
    });
    it('should throw an error code 11000 when logging if email already exists', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      await expect(service.login(loginDto)).rejects.toThrow(Error);
    });
  });
});
