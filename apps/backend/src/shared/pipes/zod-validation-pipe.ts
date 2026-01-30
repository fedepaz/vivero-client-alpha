// src/shared/pipes/zod-validation-pipe.ts

import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z, ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): z.infer<typeof this.schema> {
    try {
      const result = this.schema.safeParse(value);

      if (result.success) return result.data;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          error: error.flatten(),
        });
      }
      throw new BadRequestException('Validation error');
    }
    throw new BadRequestException('Validation error');
  }
}
