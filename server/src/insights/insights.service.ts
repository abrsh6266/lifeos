import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface Insight {
  type: string;
  message: string;
  severity: "info" | "warning" | "success";
}

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [energyLogs, decisions, habits, reflections] = await Promise.all([
      this.prisma.energyLog.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: "desc" },
      }),
      this.prisma.decision.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.habit.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: "desc" },
      }),
      this.prisma.reflection.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: "desc" },
      }),
    ]);

    // Rule 1: Energy trend (this week vs last week)
    this.analyzeEnergyTrend(energyLogs, insights);

    // Rule 2: Peak energy day of week
    this.analyzePeakEnergyDay(energyLogs, insights);

    // Rule 3: High regret pattern
    this.analyzeRegretPattern(decisions, insights);

    // Rule 4: Decision fatigue
    this.analyzeDecisionFatigue(decisions, insights);

    // Rule 5: Habit consistency
    this.analyzeHabitConsistency(habits, insights);

    // Rule 6: Habit-focus correlation
    this.analyzeHabitFocusCorrelation(habits, energyLogs, insights);

    // Rule 7: Reflection gap
    this.analyzeReflectionGap(reflections, insights);

    return insights;
  }

  private analyzeEnergyTrend(
    logs: { energyLevel: number; date: Date }[],
    insights: Insight[],
  ) {
    if (logs.length < 7) return;

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeek = logs.filter((l) => new Date(l.date) >= oneWeekAgo);
    const lastWeek = logs.filter(
      (l) => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < oneWeekAgo,
    );

    if (thisWeek.length === 0 || lastWeek.length === 0) return;

    const thisAvg =
      thisWeek.reduce((s, l) => s + l.energyLevel, 0) / thisWeek.length;
    const lastAvg =
      lastWeek.reduce((s, l) => s + l.energyLevel, 0) / lastWeek.length;

    if (thisAvg < lastAvg - 1) {
      insights.push({
        type: "energy_declining",
        message: `Your energy has dropped from ${lastAvg.toFixed(1)} to ${thisAvg.toFixed(1)} this week. Consider reviewing your sleep and exercise routine.`,
        severity: "warning",
      });
    } else if (thisAvg > lastAvg + 1) {
      insights.push({
        type: "energy_improving",
        message: `Your energy improved from ${lastAvg.toFixed(1)} to ${thisAvg.toFixed(1)} this week. Keep doing what you're doing!`,
        severity: "success",
      });
    }
  }

  private analyzePeakEnergyDay(
    logs: { energyLevel: number; date: Date }[],
    insights: Insight[],
  ) {
    if (logs.length < 7) return;

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayAverages: Record<number, number[]> = {};
    for (const log of logs) {
      const day = new Date(log.date).getDay();
      if (!dayAverages[day]) dayAverages[day] = [];
      dayAverages[day].push(log.energyLevel);
    }

    let bestDay = 0;
    let bestAvg = 0;
    for (const [day, levels] of Object.entries(dayAverages)) {
      const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = parseInt(day);
      }
    }

    insights.push({
      type: "peak_energy_day",
      message: `Your energy peaks on ${dayNames[bestDay]}s (avg ${bestAvg.toFixed(1)}/10). Schedule important work on this day.`,
      severity: "info",
    });
  }

  private analyzeRegretPattern(
    decisions: { regretScore: number | null }[],
    insights: Insight[],
  ) {
    const scored = decisions.filter((d) => d.regretScore && d.regretScore > 0);
    if (scored.length < 3) return;

    const avgRegret =
      scored.reduce((s, d) => s + (d.regretScore ?? 0), 0) / scored.length;

    if (avgRegret > 6) {
      insights.push({
        type: "high_regret",
        message: `Your average regret score is ${avgRegret.toFixed(1)}/10. Consider slowing down your decision-making process and seeking more input before choosing.`,
        severity: "warning",
      });
    } else if (avgRegret < 3) {
      insights.push({
        type: "low_regret",
        message: `Your average regret score is only ${avgRegret.toFixed(1)}/10. Your decision-making process is serving you well.`,
        severity: "success",
      });
    }
  }

  private analyzeDecisionFatigue(
    decisions: { createdAt: Date }[],
    insights: Insight[],
  ) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = decisions.filter(
      (d) => new Date(d.createdAt) >= sevenDaysAgo,
    ).length;

    if (recentCount > 5) {
      insights.push({
        type: "decision_fatigue",
        message: `You've logged ${recentCount} decisions in the last 7 days. Decision fatigue may be affecting quality — try batching smaller decisions.`,
        severity: "warning",
      });
    }
  }

  private analyzeHabitConsistency(
    habits: { name: string; completed: boolean; date: Date }[],
    insights: Insight[],
  ) {
    if (habits.length === 0) return;

    const completed = habits.filter((h) => h.completed).length;
    const rate = completed / habits.length;

    if (rate > 0.8) {
      insights.push({
        type: "habit_consistency_high",
        message: `You've completed ${(rate * 100).toFixed(0)}% of your habits this month. Outstanding consistency!`,
        severity: "success",
      });
    } else if (rate < 0.4) {
      insights.push({
        type: "habit_consistency_low",
        message: `Your habit completion rate is ${(rate * 100).toFixed(0)}%. Try reducing the number of habits and focusing on the most impactful ones.`,
        severity: "warning",
      });
    }
  }

  private analyzeHabitFocusCorrelation(
    habits: { completed: boolean; date: Date }[],
    energyLogs: { focusLevel: number; date: Date }[],
    insights: Insight[],
  ) {
    if (habits.length === 0 || energyLogs.length === 0) return;

    const dateToFocus: Record<string, number> = {};
    for (const log of energyLogs) {
      const key = new Date(log.date).toISOString().split("T")[0];
      dateToFocus[key] = log.focusLevel;
    }

    const dateToCompletion: Record<string, { done: number; total: number }> =
      {};
    for (const h of habits) {
      const key = new Date(h.date).toISOString().split("T")[0];
      if (!dateToCompletion[key]) dateToCompletion[key] = { done: 0, total: 0 };
      dateToCompletion[key].total++;
      if (h.completed) dateToCompletion[key].done++;
    }

    const highCompletionFocus: number[] = [];
    const lowCompletionFocus: number[] = [];

    for (const [date, comp] of Object.entries(dateToCompletion)) {
      const focus = dateToFocus[date];
      if (focus === undefined) continue;
      const rate = comp.done / comp.total;
      if (rate >= 0.7) highCompletionFocus.push(focus);
      else if (rate <= 0.3) lowCompletionFocus.push(focus);
    }

    if (highCompletionFocus.length >= 3 && lowCompletionFocus.length >= 3) {
      const highAvg =
        highCompletionFocus.reduce((a, b) => a + b, 0) /
        highCompletionFocus.length;
      const lowAvg =
        lowCompletionFocus.reduce((a, b) => a + b, 0) /
        lowCompletionFocus.length;

      if (highAvg > lowAvg + 1.5) {
        insights.push({
          type: "habit_focus_correlation",
          message: `When you complete your habits, your focus is ${highAvg.toFixed(1)} vs ${lowAvg.toFixed(1)} on off days. Habits and focus are strongly linked for you.`,
          severity: "info",
        });
      }
    }
  }

  private analyzeReflectionGap(
    reflections: { date: Date }[],
    insights: Insight[],
  ) {
    if (reflections.length === 0) {
      insights.push({
        type: "no_reflections",
        message:
          "You haven't written any reflections recently. Daily reflection improves self-awareness and decision quality.",
        severity: "warning",
      });
      return;
    }

    const lastReflection = new Date(reflections[0].date);
    const daysSince = Math.floor(
      (Date.now() - lastReflection.getTime()) / 86400000,
    );

    if (daysSince > 3) {
      insights.push({
        type: "reflection_gap",
        message: `It's been ${daysSince} days since your last reflection. Regular journaling helps identify behavioral patterns.`,
        severity: "warning",
      });
    }
  }
}
