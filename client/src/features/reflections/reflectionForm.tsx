"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { useCreateReflection } from "@/hooks/useReflections";
import { useUIStore } from "@/store/useUIStore";

export default function ReflectionForm() {
  const [goodThings, setGoodThings] = useState("");
  const [badThings, setBadThings] = useState("");
  const [lesson, setLesson] = useState("");
  const selectedDate = useUIStore((s) => s.selectedDate);
  const mutation = useCreateReflection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodThings.trim() || !badThings.trim() || !lesson.trim()) return;

    mutation.mutate(
      { goodThings, badThings, lesson, date: selectedDate },
      {
        onSuccess: () => {
          setGoodThings("");
          setBadThings("");
          setLesson("");
        },
      },
    );
  };

  return (
    <Card title="Daily Reflection">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="What went well today?"
          placeholder="The good things that happened..."
          value={goodThings}
          onChange={(e) => setGoodThings(e.target.value)}
          required
        />
        <TextArea
          label="What didn't go well?"
          placeholder="Challenges and difficulties..."
          value={badThings}
          onChange={(e) => setBadThings(e.target.value)}
          required
        />
        <TextArea
          label="Key lesson or takeaway"
          placeholder="What did you learn?"
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          required
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Saving..." : "Save Reflection"}
        </Button>
      </form>
    </Card>
  );
}
