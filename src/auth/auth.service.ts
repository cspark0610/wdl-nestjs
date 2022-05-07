import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { SignUpDto } from 'src/auth/dtos/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dtos/login.dto';

@Injectable()
export class AuthService {
  readonly salt = 10;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;

    const hashPassword = await bcrypt.hash(password, this.salt);
    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        role,
      });

      const token = await this.assignJwtToken(user._id, this.jwtService);
      return { token: token };
    } catch (error) {
      console.log(error);
      if (error.code === 11000)
        throw new ConflictException('Email already exists');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user)
      throw new UnauthorizedException(`user iwth email ${email} not found`);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
    const token = await this.assignJwtToken(user._id, this.jwtService);

    return { token: token };
  }
}
