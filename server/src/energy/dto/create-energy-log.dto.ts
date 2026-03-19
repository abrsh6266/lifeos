import { IsDateString, IsInt, Max, Min } from "class-validator";

export class CreateEnergyLogDto {
  @IsInt()
  @Min(1)
  @Max(10)
  energyLevel!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  focusLevel!: number;

  @IsDateString()
  date!: string;
}
