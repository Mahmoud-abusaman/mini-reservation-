import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

export type EnvVariables = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
};

export type UnifiedApiResponse<T> = {
  success: boolean;
  data?: T;
  meta?: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

declare global {
  namespace Express {
    interface Request {
      user: ActiveUserData;
    }
  }
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}
