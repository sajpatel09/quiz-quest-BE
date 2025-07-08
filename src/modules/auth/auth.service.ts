import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(user: UserDocument) {
    return {
      accessToken: this.jwtService.sign({
        sub: user._id,
        email: user.email,
      }),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async signup(data: SignupDto) {
    try {
      const existingUser = await this.userModel.find();

      if (existingUser.length) {
        throw new BadRequestException({
          message: 'Only one user can signup',
        });
      }

      const hashedPassword = await this.hashPassword(data.password);

      const newUser = await this.userModel.create({
        ...data,
        password: hashedPassword,
      });

      return {
        user: Object.assign(newUser, { password: undefined }),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error,
          message: error?.message,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: data.email });

      if (!user) {
        throw new BadRequestException({
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException({
          message: 'Invalid credentials',
        });
      }

      const { accessToken } = this.generateAccessToken(user);

      await user.save();

      return {
        user: Object.assign(user, { password: undefined, tokens: undefined }),
        accessToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.response?.error,
          message: error?.message,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
