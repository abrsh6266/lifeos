import api from "./api";
import { Insight } from "@/types";

export const insightsService = {
  get: async (): Promise<Insight[]> => {
    const res = await api.get<Insight[]>("/insights");
    return res.data;
  },
};
