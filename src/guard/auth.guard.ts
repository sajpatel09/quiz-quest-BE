import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const allowForGuestMode = request.url?.includes?.("/auth/signup");

    const token = request.cookies['accessToken'];

    if (!token) {
      if(allowForGuestMode) {
        return true;
      }
      throw new ForbiddenException('User not authenticated.');
    }

    const payload = await this.authService.verifyAccessToken(token);

    const userId = payload?.sub || payload?._id;
    if (!userId) {
      if(allowForGuestMode) {
        return true;
      }
      throw new ForbiddenException('User not authenticated.');
    }

    const user = await this.authService.getUserById(userId);
    if (!user) {
      if(allowForGuestMode) {
        return true;
      }
      throw new ForbiddenException('Access denied');
    }

    request['user'] = user;

    return true;
  }
}
