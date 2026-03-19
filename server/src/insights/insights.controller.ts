import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { InsightsService } from "./insights.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("insights")
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getInsights(@CurrentUser() user: { id: string }) {
    return this.insightsService.generateInsights(user.id);
  }
}
