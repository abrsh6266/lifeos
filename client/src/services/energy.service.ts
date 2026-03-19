import api from "./api";
import { EnergyLog } from "@/types";

export const energyService = {
  log: async (data: {
    energyLevel: number;
    focusLevel: number;
    date: string;
  }): Promise<EnergyLog> => {
    const res = await api.post<EnergyLog>("/energy", data);
    return res.data;
  },

  getByRange: async (from: string, to: string): Promise<EnergyLog[]> => {
    const res = await api.get<EnergyLog[]>(`/energy?from=${from}&to=${to}`);
    return res.data;
  },

  getToday: async (): Promise<EnergyLog | null> => {
    const res = await api.get<EnergyLog | null>("/energy/today");
    return res.data;
  },
};
