import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHabitDto } from "./dto/create-habit.dto";

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateHabitDto) {
    const date = new Date(dto.date);
    return this.prisma.habit.upsert({
      where: {
        userId_name_date: { userId, name: dto.name, date },
      },
      update: { completed: dto.completed ?? false },
      create: {
        userId,
        name: dto.name,
        date,
        completed: dto.completed ?? false,
      },
    });
  }

  async toggleComplete(id: string, userId: string) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
    });
    if (!habit) throw new NotFoundException("Habit not found");

    return this.prisma.habit.update({
      where: { id },
      data: { completed: !habit.completed },
    });
  }

  async findByDate(userId: string, date: string) {
    const d = new Date(date);
    return this.prisma.habit.findMany({
      where: { userId, date: d },
      orderBy: { name: "asc" },
    });
  }

  async getStreak(userId: string, habitName: string): Promise<number> {
    const habits = await this.prisma.habit.findMany({
      where: { userId, name: habitName, completed: true },
      orderBy: { date: "desc" },
    });

    if (habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < habits.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      const habitDate = new Date(habits[i].date);
      habitDate.setHours(0, 0, 0, 0);

      if (habitDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getHabitNames(userId: string): Promise<string[]> {
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: { name: true },
      distinct: ["name"],
    });
    return habits.map((h) => h.name);
  }

  async getRecentByUser(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);
    return this.prisma.habit.findMany({
      where: {
        userId,
        date: { gte: since },
      },
      orderBy: { date: "desc" },
    });
  }
}
