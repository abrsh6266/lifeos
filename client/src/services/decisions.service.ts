import api from "./api";
import { Decision, PaginatedResponse } from "@/types";

export const decisionsService = {
  create: async (data: {
    title: string;
    context?: string;
    choiceMade: string;
    outcome?: string;
    regretScore?: number;
  }): Promise<Decision> => {
    const res = await api.post<Decision>("/decisions", data);
    return res.data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Decision>> => {
    const res = await api.get<PaginatedResponse<Decision>>(
      `/decisions?page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  update: async (
    id: string,
    data: { outcome?: string; regretScore?: number },
  ): Promise<Decision> => {
    const res = await api.patch<Decision>(`/decisions/${id}`, data);
    return res.data;
  },
};
