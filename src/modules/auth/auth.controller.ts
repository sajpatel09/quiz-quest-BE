import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto, SignupDto} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    async signup(@Body() data: SignupDto) {
        return this.authService.signup(data);
    }

    @Post('login')
    async login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }
}
