import api from "./api";
import { Habit } from "@/types";

export const habitsService = {
  create: async (data: {
    name: string;
    date: string;
    completed?: boolean;
  }): Promise<Habit> => {
    const res = await api.post<Habit>("/habits", data);
    return res.data;
  },

  getByDate: async (date: string): Promise<Habit[]> => {
    const res = await api.get<Habit[]>(`/habits?date=${date}`);
    return res.data;
  },

  toggle: async (id: string): Promise<Habit> => {
    const res = await api.patch<Habit>(`/habits/${id}/toggle`);
    return res.data;
  },

  getNames: async (): Promise<string[]> => {
    const res = await api.get<string[]>("/habits/names");
    return res.data;
  },

  getStreak: async (name: string): Promise<number> => {
    const res = await api.get<number>(
      `/habits/streak/${encodeURIComponent(name)}`,
    );
    return res.data;
  },
};
