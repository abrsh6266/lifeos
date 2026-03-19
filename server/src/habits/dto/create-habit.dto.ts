import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateHabitDto {
  @IsString()
  name!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
