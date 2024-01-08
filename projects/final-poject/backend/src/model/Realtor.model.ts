import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import User from './User.model';
import Photo from './Photo.model';

@Entity('Realtor')
class Realtor extends User {
  @OneToOne(() => User, { cascade: true, eager: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => Photo, { cascade: true, eager: true, nullable: false })
  @JoinColumn()
  photo: Photo;

  @Column()
  phone: string;

  @Column()
  website: string;

  @Column({ default: 0 })
  rating: number;
}

export default Realtor;
