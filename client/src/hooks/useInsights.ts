import { insightsService } from "@/services/insights.service";
import { useQuery } from "@tanstack/react-query";

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: () => insightsService.get(),
    staleTime: 5 * 60 * 100, //refresh every 5 minutes
  });
}
