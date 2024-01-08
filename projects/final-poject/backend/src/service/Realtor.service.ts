import bcrypt from 'bcrypt';
import { ILogin } from '../interface/auth';
import { BadRequestError } from '../error';
import { AppDataSource } from '../database/data-source';
import { Repository } from 'typeorm';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../constant';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IJwtPayload } from '../interface/jwt';
import User from '../model/User.model';
import Realtor from '../model/Realtor.model';
import { IRealtorSignup, IRealtorSignupErrors } from '../interface/realtor';
import Photo from '../model/Photo.model';

const SALT_ROUNDS = 10;

class RealtorService {
  private static realtorRepository: Repository<Realtor> =
    AppDataSource.getRepository(Realtor);

  private static getRealtorRepository(): Repository<Realtor> {
    if (!RealtorService.realtorRepository) {
      RealtorService.realtorRepository = AppDataSource.getRepository(Realtor);
    }
    return RealtorService.realtorRepository;
  }

  private static async findUserByEmail(email: string): Promise<Realtor | null> {
    try {
      const userRepository = RealtorService.getRealtorRepository();
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
      const userRepository = RealtorService.getRealtorRepository();
      const user = await userRepository.findOne({ where: { username } });
      return user || null;
    } catch (error) {
      throw new BadRequestError(error + '');
    }
  }

  private static async validateSignup(body: IRealtorSignup) {
    const errors: IRealtorSignupErrors = {
      email: [],
      username: [],
      password: [],
      confirmPassword: [],
      website: [],
      phone: [],
      photo: [],
      rating: [],
    };

    const { username, email, password, confirmPassword } = body;

    // Check if email or username already exists
    const existingUserByEmail = await RealtorService.findUserByEmail(email);
    const existingUserByUsername =
      await RealtorService.findUserByUsername(username);

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

  static async signup(body: IRealtorSignup) {
    try {
      await RealtorService.validateSignup(body);

      const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

      const realtorRepository = RealtorService.getRealtorRepository();
      const photoRepository = AppDataSource.getRepository(Photo);

      // Create Photo
      const photo = new Photo();
      photo.src = body.photo;
      photo.alt = 'Photo description';

      // Create user and pass photo created
      const realtor = realtorRepository.create({
        ...body,
        photo: photo,
        password: hashedPassword,
      });

      // Save photo
      await photoRepository.save(photo);
      await realtorRepository.save(realtor);

      return {
        data: realtor,
        message: 'Signed up successfully!',
      };
    } catch (error) {
      throw new BadRequestError(error + '');
    }
  }

  static async login(body: ILogin) {
    // Check if email or username already exists
    const user = await RealtorService.findUserByEmail(body.email);

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

  private static generateAccessToken(realtor: Realtor) {
    const { accessTokenSecret } = config.jwt;
    const jwtPayload: IJwtPayload = {
      id: realtor.id,
      email: realtor.email,
      username: realtor.username,
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
    const realtor = await RealtorService.findUserByEmail(decoded.email);

    if (!realtor) {
      throw new BadRequestError('User not found');
    }

    const accessToken = RealtorService.generateAccessToken(realtor);

    return accessToken;
  }
}

export default RealtorService;
