import {Body, Controller, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from './auth.service';
import {LoginDto, SignupDto} from './dto/auth.dto';

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
}
