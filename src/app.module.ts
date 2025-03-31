import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Login } from './entities/login.entity';
import { Employee } from './entities/employee.entity';
import { AuthModule } from './auth/auth.module';
import { EmployeeController } from './employees/employee.controller';
import { EmployeeService } from './employees/employee.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Invent@123',
      database: 'employee_management',
      entities: [User, Employee, Login],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'mySuperSecretKey123', // ✅ Consistent secret key
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class AppModule {}


