import { Role } from 'generated/prisma/enums';

export interface ActiveUserData {
  id: number;
  email: string;
  role: Role;
}
