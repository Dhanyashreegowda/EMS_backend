import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from './user.entity';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;
}
