import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DecisionsService } from "./decisions.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateDecisionDto } from "./dto/create-decision.dto";
import { PaginationQUeryDto } from "../common/dto/pagination-query.dto";
import { UpdateDecisionDto } from "./dto/update-decision.dto";

@Controller("decisions")
@UseGuards(JwtAuthGuard)
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateDecisionDto) {
    return this.decisionsService.create(user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Query() query: PaginationQUeryDto,
  ) {
    return this.decisionsService.findAllByUser(
      user.id,
      query.page,
      query.limit,
    );
  }

  @Get(":id")
  findOne(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.decisionsService.findOne(id, user.id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
    @Body() dto: UpdateDecisionDto,
  ) {
    return this.decisionsService.update(id, user.id, dto);
  }
}
