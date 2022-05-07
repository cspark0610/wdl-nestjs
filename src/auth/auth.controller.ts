import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { SignUpDto } from 'src/auth/dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    const token = await this.authService.signUp(signUpDto);
    return token;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);
    return token;
  }
  @Get('me')
  @UseGuards(AuthGuard())
  async getProfile(@CurrentUser() currentUser): Promise<any> {
    return currentUser;
  }
}
