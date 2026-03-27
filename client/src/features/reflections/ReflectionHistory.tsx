"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useReflections } from "@/hooks/useReflections";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReflectionHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReflections(page, 5);

  if (isLoading)
    return (
      <Card>
        <p className="text-slate-400">Loading...</p>
      </Card>
    );

  const reflections = data?.data || [];
  const meta = data?.meta;

  return (
    <Card title="Reflection History">
      {reflections.length === 0 ? (
        <p className="text-slate-400 text-sm">No reflections yet.</p>
      ) : (
        <div className="space-y-4">
          {reflections.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3"
            >
              <p className="text-xs text-slate-400 font-medium">
                {new Date(r.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                  Good
                </p>
                <p className="text-sm text-slate-700">{r.goodThings}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                  Challenges
                </p>
                <p className="text-sm text-slate-700">{r.badThings}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                  Lesson
                </p>
                <p className="text-sm text-slate-700">{r.lesson}</p>
              </div>
            </div>
          ))}

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
