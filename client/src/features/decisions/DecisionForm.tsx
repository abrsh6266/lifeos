"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { useCreateDecision } from "@/hooks/useDecisions";

export default function DecisionForm() {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [choiceMade, setChoiceMade] = useState("");
  const mutation = useCreateDecision();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !choiceMade.trim()) return;

    mutation.mutate(
      { title, context: context || undefined, choiceMade },
      {
        onSuccess: () => {
          setTitle("");
          setContext("");
          setChoiceMade("");
        },
      },
    );
  };

  return (
    <Card title="Log a Decision">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Decision Title"
          placeholder="What decision did you face?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          label="Context (optional)"
          placeholder="What was the situation?"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <TextArea
          label="Choice Made"
          placeholder="What did you choose to do?"
          value={choiceMade}
          onChange={(e) => setChoiceMade(e.target.value)}
          required
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Decision"}
        </Button>
      </form>
    </Card>
  );
}
