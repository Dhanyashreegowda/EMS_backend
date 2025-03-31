import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.mobile_number, body.role);
  }
  

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create-employee')
  async createEmployee(@Request() req) {
    return { message: `Employee created by ${req.user.email}` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ASSISTANT_HR')
  @Get('verify-employee')
  async verifyEmployee(@Request() req) {
    return { message: `Employee details visible to Assistant HR: ${req.user.email}` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAGER')
  @Post('edit-employee')
  async editEmployee(@Request() req) {
    return { message: `Manager editing details for ${req.user.email}` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR')
  @Post('final-submit')
  async finalSubmit(@Request() req) {
    return { message: `HR submitted final details by ${req.user.email}` };
  }
}
