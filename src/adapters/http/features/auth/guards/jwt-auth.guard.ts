import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AccessTokenExpiredException, InvalidAccessTokenException } from '../../../../../core/commons/exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err, user, info) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new AccessTokenExpiredException('Session expired. Please log in.', err || info);
      }

      if (info.message === 'No auth token') {
        throw new InvalidAccessTokenException('You are not authenticated. Please log in.', err || info);
      }

      throw new InvalidAccessTokenException(
        'An error occurred while authenticating the user. Please log in again.',
        err || info
      );
    }
    return user;
  }
}
