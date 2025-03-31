import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  alternateEmail?: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  alternateMobile?: string;

  @Column({ unique: true })
  empId: string;

  @Column({ nullable: true })
  passportNumber?: string;

  @Column({ nullable: true })
  aadharNumber?: string;

  @Column({ nullable: true })
  panCardNumber?: string;

  @Column()
  designation: string;
 
  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;

  @Column({ nullable: true })
  passportFile?: string;  // Stores file path

  @Column({ nullable: true })
  aadharFile?: string;

  @Column({ nullable: true })
  panFile?: string;

  // Verification fields
  @Column({ default: false })
  assistantHrVerified: boolean;

  @Column({ nullable: true })
  assistantHrVerificationDate?: Date;

  @Column({ default: false })
  managerVerified: boolean;

  @Column({ nullable: true })
  managerVerificationDate?: Date;

  @Column({ default: false })
  hrVerified: boolean;

  @Column({ nullable: true })
  hrVerificationDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}



