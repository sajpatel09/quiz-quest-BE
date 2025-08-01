import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User, UserDocument} from './schemas/user.schema';
import {LoginDto, SignupDto} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {
    }

    generateAccessToken(user: UserDocument) {
        return {
            accessToken: this.jwtService.sign({
                sub: user._id,
                email: user.email,
            }),
        };
    }

    verifyAccessToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch {
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async signup(data: SignupDto, user?: User) {
        try {
            const existingUser = await this.userModel.findOne({email: data.email});
            if (existingUser) {
                throw new BadRequestException({
                    message: 'User with this email already exists',
                });
            }

            const hashedPassword = await this.hashPassword(data.password);

            if (user?._id) {
                await this.userModel.updateOne({_id: user._id},
                    {...data, password: hashedPassword, role: "User"},
                    {new: true}
                )

                const savedUser = await this.userModel.findOne({_id: user._id});

                if (savedUser) {
                    const {accessToken} = this.generateAccessToken(savedUser);

                    return {
                        user: Object.assign(savedUser, {password: undefined}),
                        accessToken,
                    };
                } else {
                    throw new BadRequestException({
                        message: 'User not found',
                    });
                }

            } else {


                const newUser = await this.userModel.create({
                    ...data,
                    password: hashedPassword,
                });

                const {accessToken} = this.generateAccessToken(newUser);

                return {
                    user: Object.assign(newUser, {password: undefined}),
                    accessToken,
                };
            }
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
            const user = await this.userModel.findOne({email: data.email});

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

            const {accessToken} = this.generateAccessToken(user);

            await user.save();

            return {
                user: Object.assign(user, {password: undefined, tokens: undefined}),
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

    async getUserById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }

    async updateUserCoin(userId: string, coinDelta: number): Promise<number> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        user.coin = (user.coin || 0) + coinDelta;
        await user.save();
        return user.coin;
    }

    async guestLogin() {
        const user = await this.userModel.create({})

        return this.generateAccessToken(user);
    }
}
