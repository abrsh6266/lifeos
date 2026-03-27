import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsService } from "@/services/habits.service";

export function useHabitsByDate(date: string) {
  return useQuery({
    queryKey: ["habits", date],
    queryFn: () => habitsService.getByDate(date),
  });
}

export function useHabitNames() {
  return useQuery({
    queryKey: ["habits", "names"],
    queryFn: () => habitsService.getNames(),
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsService.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
