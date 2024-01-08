import { ISignup, ISignupErrors } from './auth';

export interface IRealtorSignup extends ISignup {
  photo: string;
  phone: string;
  website: string;
  rating: number;
}

export interface IRealtorSignupErrors extends ISignupErrors {
  website: string[];
  phone: string[];
  photo: string[];
  rating: string[];
}
