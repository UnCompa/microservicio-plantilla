import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/core/application/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prismaService: PrismaService, // Servicio de Prisma inyectado
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Verifica la conectividad con Google
      () => this.http.pingCheck('google', 'https://www.google.com'),

      // Verifica la salud de la base de datos usando Prisma
      () => this.prismaHealth.pingCheck('database', this.prismaService), // Pasa el cliente de Prisma
    ]);
  }
}
