import { UserRole } from '../enums/user-role.enum';

export interface AuthUser {
  id: number;
  email: string;
  token?: string;
  role: UserRole;
}

export interface UserInterface {
  id?: number;
  email: string;
  password?: string;
  role: UserRole;
  updatedAt?: Date;
  createdAt?: Date;
}
