"use client";
import React from "react";
import Card from "@/components/ui/Card";
import { useEnergyLogs } from "@/hooks/useEnergy";

export default function EnergyHistory() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const from = thirtyDaysAgo.toISOString().split("T")[0];
  const to = new Date().toISOString().split("T")[0];

  const { data: logs, isLoading } = useEnergyLogs(from, to);

  if (isLoading)
    return (
      <Card>
        <p className="text-slate-400">Loading...</p>
      </Card>
    );

  return (
    <Card title="Energy History (30 Days)">
      {!logs || logs.length === 0 ? (
        <p className="text-slate-400 text-sm">No energy logs yet.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
            >
              <span className="text-sm text-slate-600">
                {new Date(log.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Energy</span>
                  <div className="flex items-center">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{ width: `${log.energyLevel * 8}px` }}
                    />
                    <span className="ml-1.5 text-sm font-medium text-slate-700">
                      {log.energyLevel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Focus</span>
                  <div className="flex items-center">
                    <div
                      className="h-2 rounded-full bg-indigo-400"
                      style={{ width: `${log.focusLevel * 8}px` }}
                    />
                    <span className="ml-1.5 text-sm font-medium text-slate-700">
                      {log.focusLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
