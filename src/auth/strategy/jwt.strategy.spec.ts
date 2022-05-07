import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserRoles } from 'src/users/schemas/user.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

describe('jwt Strategy', () => {
  let jwtStrategy: JwtStrategy;
  let model: Model<User>;
  const mockUser = {
    _id: '61cd5ekcsv66945x1wc',
    email: 'user1@mail.com',
    name: 'namefake',
    role: UserRoles.USER,
  };
  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'secret-key';
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        JwtStrategy,
        { provide: getModelToken(User.name), useValue: mockUserService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });
  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when user is valid', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any);

      const result = await jwtStrategy.validate({ id: mockUser._id });
      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw unauthorized exception if found user does not exists', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
      await expect(jwtStrategy.validate({ id: mockUser._id })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
