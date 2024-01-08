import { Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';

@Entity('User')
class User extends BaseModel {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}

export default User;
