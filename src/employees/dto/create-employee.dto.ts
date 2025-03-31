// src/employees/dto/create-employee.dto.ts
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
@IsNotEmpty()
email: string;

@IsEmail()
@ValidateIf((o) => o.alternateEmail !== o.email) // Ensure alternate is different
alternateEmail: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  alternateMobile: string;

  @IsNotEmpty()
  empId: string;

  @IsOptional()
  passportNumber?: string;

  @IsOptional()
  aadharNumber?: string;

  @IsOptional()
  panCardNumber?: string;

  @IsString()
  designation: string;

  @IsNumber()
  salary: number;
}
