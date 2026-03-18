import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDecisionDto } from "./dto/create-decision.dto";
import { UpdateDecisionDto } from "./dto/update-decision.dto";

@Injectable()
export class DecisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDecisionDto) {
    return this.prisma.decision.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.decision.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.decision.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string, userId: string) {
    const decision = await this.prisma.decision.findFirst({
      where: { id, userId },
    });
    if (!decision) throw new NotFoundException("Decision not found");

    return decision;
  }

  async update(id: string, userId: string, dto: UpdateDecisionDto) {
    await this.findOne(id, userId);
    return this.prisma.decision.update({
      where: { id },
      data: dto,
    });
  }

  async getRecentByUser(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.prisma.decision.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    });
  }
}
