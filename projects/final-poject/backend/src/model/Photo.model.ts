import { Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';

@Entity('Photo')
class Photo extends BaseModel {
  @Column()
  src: string;

  @Column()
  alt: string;
}

export default Photo;
