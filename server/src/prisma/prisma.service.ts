import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const stripTimezone = (obj: unknown): unknown => {
  if (!obj) return obj;
  if (obj instanceof Date) return obj.toISOString().split('T')[0];
  if (Array.isArray(obj)) return obj.map((item) => stripTimezone(item));
  if (typeof obj === 'object') {
    const source = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      if (key === 'createdAt' || key === 'updatedAt') {
        result[key] = source[key];
      } else {
        result[key] = stripTimezone(source[key]);
      }
    }
    return result;
  }
  return obj;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const result = await query(args);
            return stripTimezone(result);
          },
        },
      },
    }) as any;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

