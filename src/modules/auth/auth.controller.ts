import {Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from './auth.service';
import {LoginDto, SignupDto, UpdateCoinDto} from './dto/auth.dto';
import {AuthGuard} from "../../guard/auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    async signup(@Body() data: SignupDto, @Res({passthrough: true}) res: Response) {
        const resData = await this.authService.signup(data);
        res.cookie('accessToken', resData.accessToken, {httpOnly: true, secure: false, sameSite: 'lax'});
        return resData;
    }

    @Post('login')
    async login(@Body() data: LoginDto, @Res({passthrough: true}) res: Response) {
        const resData = await this.authService.login(data);
        res.cookie('accessToken', resData.accessToken, {httpOnly: true, secure: false, sameSite: 'lax'});
        return resData;
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('accessToken');
        return {message: 'Logged out successfully'};
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@Req() request: Request) {
        const user = request['user'];
        return {user};
    }

    @UseGuards(AuthGuard)
    @Post('update-coin')
    async updateCoin(@Req() request: Request, @Body() body: UpdateCoinDto) {
        const user = request['user'];
        const updatedCoin = await this.authService.updateUserCoin(user._id, body.coin);
        return { coin: updatedCoin };
    }
}
