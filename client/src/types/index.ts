export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Decision {
  id: string;
  title: string;
  context?: string;
  choiceMade: string;
  outcome?: string;
  regretScore?: number;
  createdAt: string;
  userId: string;
}

export interface EnergyLog {
  id: string;
  energyLevel: number;
  focusLevel: number;
  date: string;
  userId: string;
}

export interface Reflection {
  id: string;
  goodThings: string;
  badThings: string;
  lesson: string;
  date: string;
  userId: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  userId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Insight {
  type: string;
  message: string;
  severity: "info" | "warning" | "success";
}
