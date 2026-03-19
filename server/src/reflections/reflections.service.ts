import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReflectionDto } from "./dto/create-reflection.dto";

@Injectable()
export class ReflectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: CreateReflectionDto) {
    const date = new Date(dto.date);
    return this.prisma.reflection.upsert({
      where: {
        userId_date: { userId, date },
      },
      update: {
        goodThings: dto.goodThings,
        badThings: dto.badThings,
        lesson: dto.lesson,
      },
      create: {
        userId,
        date,
        goodThings: dto.goodThings,
        badThings: dto.badThings,
        lesson: dto.lesson,
      },
    });
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.reflection.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.reflection.count({ where: { userId } }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRecentByUser(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);
    return this.prisma.reflection.findMany({
      where: {
        userId,
        date: { gte: since },
      },
      orderBy: { date: "desc" },
    });
  }
}
