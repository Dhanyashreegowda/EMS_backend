import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Check if employee with same email already exists
    const existingEmployee = await this.employeeRepository.findOne({ 
      where: { email: createEmployeeDto.email } 
    });

    if (existingEmployee) {
      throw new BadRequestException('Employee with this email already exists');
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return await this.employeeRepository.find();
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    return await this.employeeRepository.remove(employee);
  }

  async getUnverified() {
    return this.employeeRepository.find({ 
      where: { assistantHrVerified: false } 
    });
  }

  async verifyByAssistantHr(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }

    if (employee.assistantHrVerified) {
      throw new Error('Employee is already verified by Assistant HR');
    }

    employee.assistantHrVerified = true;
    employee.assistantHrVerificationDate = new Date();
    await this.employeeRepository.save(employee);

    return { message: 'Employee verified successfully' };
  }

  async getEmployeesForManager() {
    return this.employeeRepository.find({ 
      where: { 
        assistantHrVerified: true,
        managerVerified: false,
        hrVerified: false
      } 
    });
  }
  
  async verifyByManager(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }

    if (!employee.assistantHrVerified) {
      throw new Error('Employee must be verified by Assistant HR first');
    }

    if (employee.managerVerified) {
      throw new Error('Employee is already verified by Manager');
    }

    employee.managerVerified = true;
    employee.managerVerificationDate = new Date();
    await this.employeeRepository.save(employee);

    return { message: 'Employee verified by Manager successfully' };
  }

  async verifyByHr(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }

    if (!employee.managerVerified) {
      throw new BadRequestException('Employee must be verified by Manager first');
    }

    if (employee.hrVerified) {
      throw new BadRequestException('Employee is already verified by HR');
    }

    employee.hrVerified = true;
    employee.hrVerificationDate = new Date();
    await this.employeeRepository.save(employee);

    return { message: 'Employee finalized by HR successfully' };
  }

  async getHrUnverifiedEmployees() {
    return this.employeeRepository.find({ 
      where: { 
        assistantHrVerified: true,
        managerVerified: true,
        hrVerified: false
      } 
    });
  }

  async getVerifiedEmployees() {
    return this.employeeRepository.find({ 
      where: { hrVerified: true } 
    });
  }
}