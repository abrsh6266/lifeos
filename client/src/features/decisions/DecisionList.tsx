"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useDecisions, useUpdateDecision } from "@/hooks/useDecisions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DecisionList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDecisions(page, 5);
  const updateMutation = useUpdateDecision();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState("");
  const [regretScore, setRegretScore] = useState(5);

  if (isLoading)
    return (
      <Card>
        <p className="text-slate-400">Loading decisions...</p>
      </Card>
    );
  if (isError)
    return (
      <Card>
        <p className="text-red-400">Failed to load decisions.</p>
      </Card>
    );

  const decisions = data?.data || [];
  const meta = data?.meta;

  const handleUpdate = (id: string) => {
    updateMutation.mutate(
      { id, data: { outcome, regretScore } },
      {
        onSuccess: () => {
          setEditingId(null);
          setOutcome("");
          setRegretScore(5);
        },
      },
    );
  };

  return (
    <Card title="Decision History">
      {decisions.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No decisions logged yet. Start tracking above.
        </p>
      ) : (
        <div className="space-y-4">
          {decisions.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">{d.title}</h4>
                  <p className="text-xs text-slate-400">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {d.regretScore != null && d.regretScore > 0 && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      d.regretScore > 6
                        ? "bg-red-100 text-red-600"
                        : d.regretScore > 3
                          ? "bg-amber-100 text-amber-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    Regret: {d.regretScore}/10
                  </span>
                )}
              </div>
              {d.context && (
                <p className="text-sm text-slate-500">{d.context}</p>
              )}
              <p className="text-sm text-slate-700">
                <span className="font-medium">Choice:</span> {d.choiceMade}
              </p>
              {d.outcome && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Outcome:</span> {d.outcome}
                </p>
              )}

              {!d.outcome && editingId !== d.id && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingId(d.id)}
                >
                  Add Outcome
                </Button>
              )}

              {editingId === d.id && (
                <div className="space-y-3 mt-2 p-3 bg-white rounded-lg border border-slate-200">
                  <textarea
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What was the outcome?"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={2}
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Regret Score: {regretScore}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={regretScore}
                      onChange={(e) => setRegretScore(parseInt(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>No regret</span>
                      <span>Full regret</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(d.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
                <ChevronLeft size={16} />
                Previous
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
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
