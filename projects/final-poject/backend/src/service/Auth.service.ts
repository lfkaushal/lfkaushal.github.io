import bcrypt from 'bcrypt';
import User from '../model/User.Model';
import { ILogin, ISignup, ISignupErrors } from '../interface/auth';
import { BadRequestError } from '../error';
import { AppDataSource } from '../database/data-source';
import { Repository } from 'typeorm';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../constant';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IJwtPayload } from '../interface/jwt';

const SALT_ROUNDS = 10;

class AuthService {
  private static userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  private static getUserRepository(): Repository<User> {
    if (!AuthService.userRepository) {
      AuthService.userRepository = AppDataSource.getRepository(User);
    }
    return AuthService.userRepository;
  }

  private static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const userRepository = AuthService.getUserRepository();
      const user = await userRepository.findOne({ where: { email } });
      return user || null;
    } catch (error) {
      throw new BadRequestError(error + '');
    }
  }

  private static async findUserByUsername(
    username: string,
  ): Promise<User | null> {
    try {
      const userRepository = AuthService.getUserRepository();
      const user = await userRepository.findOne({ where: { username } });
      return user || null;
    } catch (error) {
      throw new BadRequestError(error + '');
    }
  }

  private static async validateSignup(body: ISignup) {
    const errors: ISignupErrors = {
      email: [],
      username: [],
      password: [],
      confirmPassword: [],
    };

    const { username, email, password, confirmPassword } = body;

    // Check if email or username already exists
    const existingUserByEmail = await AuthService.findUserByEmail(email);
    const existingUserByUsername =
      await AuthService.findUserByUsername(username);

    if (existingUserByEmail) {
      errors.email.push('User with this email already exists');
    }
    if (existingUserByUsername) {
      errors.username.push('User with this username already exists');
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      errors.password.push('Password and confirm password do not match');
    }

    if (Object.values(errors).some((array) => array.length > 0)) {
      throw new BadRequestError(JSON.stringify(errors));
    }
  }

  static async signup(body: ISignup) {
    try {
      await AuthService.validateSignup(body);

      const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

      const userRepository = AuthService.getUserRepository();

      const user = userRepository.create({ ...body, password: hashedPassword });
      await userRepository.save(user);
      console.log(user);

      return {
        data: user,
        message: 'Signed up successfully!',
      };
    } catch (error) {
      throw new BadRequestError(error + '');
    }
  }

  static async login(body: ILogin) {
    // Check if email or username already exists
    const user = await AuthService.findUserByEmail(body.email);

    if (!user) {
      throw new BadRequestError('User doesnt exist');
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }

    const jwtPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // We are good to go!
    const accessToken = jwt.sign(jwtPayload, config.jwt.accessTokenSecret!, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(jwtPayload, config.jwt.refreshTokenSecret!, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private static generateAccessToken(user: User) {
    const { accessTokenSecret } = config.jwt;
    const jwtPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const result = jwt.sign(jwtPayload, accessTokenSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    return result;
  }

  static async refreshToken(refresh: string) {
    const { refreshTokenSecret } = config.jwt;
    const decoded = jwt.verify(refresh, refreshTokenSecret) as IJwtPayload;

    // Check if the user exists
    const user = await AuthService.findUserByEmail(decoded.email);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const accessToken = AuthService.generateAccessToken(user);

    return accessToken;
  }
}

export default AuthService;
