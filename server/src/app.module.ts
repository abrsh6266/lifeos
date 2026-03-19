import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { DecisionsModule } from "./decisions/dicisions.module";
import { EnergyModule } from "./energy/energy.module";
import { HabitsModule } from "./habits/habits.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    DecisionsModule,
    EnergyModule,
    HabitsModule,
  ],
})
export class AppModule {}
