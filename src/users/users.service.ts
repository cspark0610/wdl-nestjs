import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid mongo ID');
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findUserGamesWinAndGamesPlayed(id: string): Promise<{
    gamesWon: number;
    gamesPlayed: number;
  }> {
    const user = await this.findById(id);
    return {
      gamesWon: user.gamesTokensWon.length || 0,
      gamesPlayed: user.gamesTokensPlayed.length || 0,
    };
  }

  async findMostWinnersUsers(): Promise<User[]> {
    const users = await this.userModel
      .find({})
      .sort({ gamesTokensWon: -1 })
      .limit(10);
    return users;
  }

  async updateById(id: string, updateBody): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateBody, {
      new: true,
      runValidators: true,
    });
    return updatedUser;
  }
}
