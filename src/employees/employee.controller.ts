import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, UploadedFiles } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

interface FileUploadResult {
  passportFile?: string;
  aadharFile?: string;
  panFile?: string;
}

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('upload-files')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'passportFile', maxCount: 1 },
    { name: 'aadharFile', maxCount: 1 },
    { name: 'panFile', maxCount: 1 }
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadFiles(
    @UploadedFiles() files: {
      passportFile?: Express.Multer.File[],
      aadharFile?: Express.Multer.File[],
      panFile?: Express.Multer.File[]
    }
  ): Promise<FileUploadResult> {
    const result: FileUploadResult = {};
    const baseUrl = 'http://localhost:3000'; // Add your server URL
    
    if (files.passportFile) {
      result.passportFile = `${baseUrl}/uploads/${files.passportFile[0].filename}`;
    }
    if (files.aadharFile) {
      result.aadharFile = `${baseUrl}/uploads/${files.aadharFile[0].filename}`;
    }
    if (files.panFile) {
      result.panFile = `${baseUrl}/uploads/${files.panFile[0].filename}`;
    }
    
    return result;
  }

  
  @Roles('ADMIN')
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Roles('ASSISTANT_HR')
  @Get('unverified') // ✅ Fix: Moved above the dynamic route to avoid conflict
  async getUnverifiedEmployees() {
    return this.employeeService.getUnverified();
  }

  @Roles('ASSISTANT_HR')
  @Patch(':id/verify')
  async verifyEmployee(@Param('id') id: number) {
    return this.employeeService.verifyByAssistantHr(id);
  }
  // Add this to your EmployeeController
@Roles('MANAGER')
@Patch(':id/manager-verify')
async verifyByManager(@Param('id') id: number) {
  return this.employeeService.verifyByManager(id);
}

@Roles('MANAGER')
@Get('manager/pending')
async getEmployeesForManager() {
  return this.employeeService.getEmployeesForManager();
}
@Roles('HR')
@Patch(':id/hr-verify')
async verifyByHr(@Param('id') id: number) {
  return this.employeeService.verifyByHr(id);
}

@Roles('HR')
@Get('hr/verified')
async getVerifiedEmployees() {
  return this.employeeService.getVerifiedEmployees();
}

@Roles('HR')
@Get('hr/unverified')
async getHrUnverifiedEmployees() {
  return this.employeeService.getHrUnverifiedEmployees();
}

  @Roles('ADMIN', 'ASSISTANT_HR', 'MANAGER', 'HR')
  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Roles('ADMIN', 'ASSISTANT_HR', 'MANAGER', 'HR')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  @Roles('MANAGER', 'ADMIN')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Roles('MANAGER', 'ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}


