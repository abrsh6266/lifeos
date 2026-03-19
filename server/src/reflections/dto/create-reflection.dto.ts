import { IsDateString, IsString } from "class-validator";

export class CreateReflectionDto {
  @IsString()
  goodThings!: string;

  @IsString()
  badThings!: string;

  @IsString()
  lesson!: string;

  @IsDateString()
  date!: string;
}
