import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";

export class CreateDecisionDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsString()
  choiceMade!: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  regretScore?: number;
}
