import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";

export class UpdateDecisionDto {
  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  regretScore?: number;
}
