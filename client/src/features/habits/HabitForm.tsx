"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateHabit } from "@/hooks/useHabits";
import { useUIStore } from "@/store/useUIStore";

export default function HabitForm() {
  const [name, setName] = useState("");
  const selectedDate = useUIStore((s) => s.selectedDate);
  const mutation = useCreateHabit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutation.mutate(
      { name: name.trim(), date: selectedDate },
      { onSuccess: () => setName("") },
    );
  };

  return (
    <Card title="Add Habit for Today">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="e.g., Meditate, Exercise, Read..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          Add
        </Button>
      </form>
    </Card>
  );
}
