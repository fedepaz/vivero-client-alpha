// src/shared/pipes/zod-validation-pipe.ts

import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): z.infer<typeof this.schema> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation error',
        errors: result.error.flatten(),
      });
    }
    return result.data;
  }
}
