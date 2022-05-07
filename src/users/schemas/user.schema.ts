import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'duplicate email entered'] })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role: string;

  @Prop({ default: [], type: [String] })
  gamesTokensWon?: string[];

  @Prop({ default: [], type: [String] })
  gamesTokensPlayed?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
