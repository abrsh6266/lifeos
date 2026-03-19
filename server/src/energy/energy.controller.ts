import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { EnergyService } from "./energy.service";
import { CreateEnergyLogDto } from "./dto/create-energy-log.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("energy")
@UseGuards(JwtAuthGuard)
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Post()
  log(@CurrentUser() user: { id: string }, @Body() dto: CreateEnergyLogDto) {
    return this.energyService.upsert(user.id, dto);
  }

  @Get()
  findByRange(
    @CurrentUser() user: { id: string },
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 86400000);
    const toDate = to ? new Date(to) : new Date();
    return this.energyService.findByDateRange(user.id, fromDate, toDate);
  }

  @Get("today")
  findToday(@CurrentUser() user: { id: string }) {
    return this.energyService.findToday(user.id);
  }
}
