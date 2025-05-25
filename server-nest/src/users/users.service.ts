import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async login(loginDto: LoginDto): Promise<{
    authenticated: boolean;
    userId?: string;
    email?: string;
    reason?: string;
  }> {
    const user = await this.userModel
      .findOne({ username: loginDto.username })
      .exec();
    if (!user) {
      return { authenticated: false, reason: 'Invalid Username' };
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (isPasswordValid) {
      return {
        authenticated: true,
        userId: user._id.toString(),
        email: user.email,
      };
    }

    return { authenticated: false, reason: 'Incorrect Password' };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ accepted: boolean; reason?: string }> {
    const user = await this.userModel
      .findOne({ username: forgotPasswordDto.username })
      .exec();
    if (!user) {
      return { accepted: false, reason: 'Invalid Username' };
    }

    const isOldPasswordValid = await argon2.verify(
      user.password,
      forgotPasswordDto.oldPassword,
    );
    if (!isOldPasswordValid) {
      return { accepted: false, reason: 'Incorrect Password' };
    }

    const hashedNewPassword = await argon2.hash(forgotPasswordDto.newPassword);
    await this.userModel
      .findByIdAndUpdate(user._id, { password: hashedNewPassword })
      .exec();

    return { accepted: true };
  }
}
