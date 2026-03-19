import api from "./api";
import { Reflection, PaginatedResponse } from "@/types";

export const reflectionsService = {
  create: async (data: {
    goodThings: string;
    badThings: string;
    lesson: string;
    date: string;
  }): Promise<Reflection> => {
    const res = await api.post<Reflection>("/reflections", data);
    return res.data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Reflection>> => {
    const res = await api.get<PaginatedResponse<Reflection>>(
      `/reflections?page=${page}&limit=${limit}`,
    );
    return res.data;
  },
};
