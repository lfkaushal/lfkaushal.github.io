import { Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';
import { IsEmail } from 'class-validator';

@Entity('User')
class User extends BaseModel {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;
}

export default User;
