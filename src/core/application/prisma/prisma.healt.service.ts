import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaHealthService {
  constructor(private prisma: PrismaService) { }

  async isDatabaseHealthy(): Promise<HealthIndicatorResult> {
    try {
      // Ejecuta una consulta para validar la conectividad con la base de datos
      await this.prisma.$queryRaw`SELECT 1`;

      // Devuelve el resultado en el formato esperado por Terminus
      return { database: { status: 'up' } };
    } catch (error) {
      // Si ocurre un error, lanza un HealthCheckError
      throw new HealthCheckError('Database check failed', {
        database: { status: 'down', error: error.message },
      });
    }
  }
}
