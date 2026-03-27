import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { energyService } from "@/services/energy.service";

export function useEnergyLogs(from: string, to: string) {
  return useQuery({
    queryKey: ["energy", from, to],
    queryFn: () => energyService.getByRange(from, to),
  });
}

export function useTodayEnergy() {
  return useQuery({
    queryKey: ["energy", "today"],
    queryFn: () => energyService.getToday(),
  });
}

export function useLogEnergy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: energyService.log,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
