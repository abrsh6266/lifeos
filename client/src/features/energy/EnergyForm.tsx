"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLogEnergy } from "@/hooks/useEnergy";
import { useUIStore } from "@/store/useUIStore";

export default function EnergyForm() {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [focusLevel, setFocusLevel] = useState(5);
  const selectedDate = useUIStore((s) => s.selectedDate);
  const mutation = useLogEnergy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      energyLevel,
      focusLevel,
      date: selectedDate,
    });
  };

  const levelEmoji = (level: number) => {
    if (level <= 3) return "😴";
    if (level <= 5) return "😐";
    if (level <= 7) return "🙂";
    return "⚡";
  };

  return (
    <Card title="Log Energy & Focus">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Energy Level: {energyLevel}/10 {levelEmoji(energyLevel)}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Focus Level: {focusLevel}/10 {levelEmoji(focusLevel)}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={focusLevel}
            onChange={(e) => setFocusLevel(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Distracted</span>
            <span>Laser-focused</span>
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending
            ? "Saving..."
            : mutation.isSuccess
              ? "✓ Saved!"
              : "Log Energy"}
        </Button>
      </form>
    </Card>
  );
}
