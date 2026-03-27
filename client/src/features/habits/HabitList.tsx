"use client";
import React from "react";
import Card from "@/components/ui/Card";
import { useHabitsByDate, useToggleHabit } from "@/hooks/useHabits";
import { useUIStore } from "@/store/useUIStore";
import { Check, Circle } from "lucide-react";

export default function HabitList() {
  const selectedDate = useUIStore((s) => s.selectedDate);
  const { data: habits, isLoading } = useHabitsByDate(selectedDate);
  const toggleMutation = useToggleHabit();

  if (isLoading)
    return (
      <Card>
        <p className="text-slate-400">Loading...</p>
      </Card>
    );

  const completed = habits?.filter((h) => h.completed).length || 0;
  const total = habits?.length || 0;

  return (
    <Card
      title={`Today's Habits ${total > 0 ? `(${completed}/${total})` : ""}`}
    >
      {!habits || habits.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No habits for this day. Add some above!
        </p>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleMutation.mutate(habit.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                habit.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  habit.completed
                    ? "bg-green-500 text-white"
                    : "border-2 border-slate-300"
                }`}
              >
                {habit.completed ? (
                  <Check size={14} />
                ) : (
                  <Circle size={14} className="text-transparent" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  habit.completed
                    ? "text-green-700 line-through"
                    : "text-slate-700"
                }`}
              >
                {habit.name}
              </span>
            </button>
          ))}

          {total > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 text-center">
                {completed === total && total > 0
                  ? "🎉 All habits completed!"
                  : `${total - completed} remaining`}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
