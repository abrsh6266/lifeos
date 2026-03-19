import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEnergyLogDto } from "./dto/create-energy-log.dto";

@Injectable()
export class EnergyService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: CreateEnergyLogDto) {
    const date = new Date(dto.date);
    return this.prisma.energyLog.upsert({
      where: {
        userId_date: { userId, date },
      },
      update: {
        energyLevel: dto.energyLevel,
        focusLevel: dto.focusLevel,
      },
      create: {
        userId,
        date,
        energyLevel: dto.energyLevel,
        focusLevel: dto.focusLevel,
      },
    });
  }

  async findByDateRange(userId: string, from: Date, to: Date) {
    return this.prisma.energyLog.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      orderBy: { date: "desc" },
    });
  }

  async findToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.energyLog.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });
  }

  async getRecentByUser(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);
    return this.prisma.energyLog.findMany({
      where: {
        userId,
        date: { gte: since },
      },
      orderBy: { date: "desc" },
    });
  }
}
