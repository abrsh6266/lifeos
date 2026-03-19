import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { decisionsService } from "@/services/decisions.service";

export function useDecisions(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["decisions", page, limit],
    queryFn: () => decisionsService.getAll(page, limit),
  });
}

export function useCreateDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: decisionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

export function useUpdateDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { outcome?: string; regretScore?: number };
    }) => decisionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
