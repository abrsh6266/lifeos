import { AuthResponse } from "@/types";
import api from "./api";

export const authService = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("auth/register", {
      email,
      password,
    });

    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("auth/login", {
      email,
      password,
    });

    return data;
  },
};
