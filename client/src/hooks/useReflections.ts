import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reflectionsService } from "@/services/reflections.service";

export function useReflections(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["reflections", page, limit],
    queryFn: () => reflectionsService.getAll(page, limit),
  });
}

export function useCreateReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reflectionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
