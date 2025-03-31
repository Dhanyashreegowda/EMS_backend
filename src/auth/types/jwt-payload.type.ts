export interface JwtPayload {
    sub: number; // This refers to the user ID
    email: string;
    role: 'ADMIN' | 'ASSISTANT_HR' | 'MANAGER' | 'HR';
  }
  