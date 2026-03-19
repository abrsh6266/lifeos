import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HabitsService } from "./habits.service";
import { CreateHabitDto } from "./dto/create-habit.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("habits")
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateHabitDto) {
    return this.habitsService.create(user.id, dto);
  }

  @Patch(":id/toggle")
  toggle(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.habitsService.toggleComplete(id, user.id);
  }

  @Get()
  findByDate(@CurrentUser() user: { id: string }, @Query("date") date: string) {
    const d = date || new Date().toISOString().split("T")[0];
    return this.habitsService.findByDate(user.id, d);
  }

  @Get("names")
  getNames(@CurrentUser() user: { id: string }) {
    return this.habitsService.getHabitNames(user.id);
  }

  @Get("streak/:name")
  getStreak(@CurrentUser() user: { id: string }, @Param("name") name: string) {
    return this.habitsService.getStreak(user.id, name);
  }
}
