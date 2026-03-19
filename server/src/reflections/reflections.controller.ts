import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ReflectionsService } from "./reflections.service";
import { CreateReflectionDto } from "./dto/create-reflection.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { PaginationQUeryDto } from "../common/dto/pagination-query.dto";

@Controller("reflections")
@UseGuards(JwtAuthGuard)
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateReflectionDto,
  ) {
    return this.reflectionsService.upsert(user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Query() query: PaginationQUeryDto,
  ) {
    return this.reflectionsService.findByUser(user.id, query.page, query.limit);
  }
}
