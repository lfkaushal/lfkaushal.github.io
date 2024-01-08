import HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import UserService from '../service/User.service';
import { ILogin, ISignup } from '../interface/auth';

class UserController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ISignup = req.body;

      const { message, data } = await UserService.signup(body);
      return res.status(HttpStatus.CREATED).json({
        message,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body: ILogin = req.body;

      const data = await UserService.login(body);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Refresh token is missing' });
    }
    try {
      const accessToken = await UserService.refreshToken(refreshToken);
      return res
        .status(HttpStatus.ACCEPTED)
        .json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
