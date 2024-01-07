import { IsDate } from 'class-validator';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  created_at: Date;

  @Column()
  @IsDate()
  updated_at: Date;
}

export default BaseModel;
