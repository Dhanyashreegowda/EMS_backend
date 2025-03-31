import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  ASSISTANT_HR = 'ASSISTANT_HR',
  MANAGER = 'MANAGER',
  HR = 'HR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  mobile_number: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN, // Default role
  })
  role: UserRole;
}


