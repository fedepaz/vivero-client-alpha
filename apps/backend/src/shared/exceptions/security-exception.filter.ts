/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/exceptions/security-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

// Create a type that includes socket information
interface SocketRequest extends Request {
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
}

@Catch(HttpException)
export class SecurityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('SecurityFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<SocketRequest>();

    // 🚨 Log ALL security-related exceptions
    if (exception.getStatus() === 403 || exception.getStatus() === 401) {
      this.logger.warn(
        `🔒 SECURITY EVENT | IP: ${this.getClientIp(request)} | ` +
          `Status: ${exception.getStatus()} | ` +
          `Path: ${request.url} | ` +
          `Message: ${exception.message}`,
      );
    }

    // 📝 Production-safe response
    const status = exception.getStatus();
    const responsePayload = {
      timestamp: new Date().toISOString(),
      path: request.url,
      // NEVER expose stack traces in production
      message:
        process.env.NODE_ENV === 'production' ? 'Access denied' : exception,
    };

    response.status(status).json(responsePayload);
  }

  private getClientIp(request: SocketRequest): string {
    // 1. Check proxy headers first (most reliable in production)
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      return Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0].trim();
    }

    // 2. Check direct connection socket
    if (request.socket?.remoteAddress) {
      return request.socket.remoteAddress;
    }

    if (request.connection?.remoteAddress) {
      return request.connection.remoteAddress;
    }

    // 3. Fallback to localhost for development
    return '127.0.0.1';
  }
}
