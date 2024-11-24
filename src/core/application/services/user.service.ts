import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from 'src/core/domain/user.entity';
import { SendData } from '../dtos/sendDataUser.dto';
import { apiBaseEntityName } from 'src/utils/api/apiEntites';
import { LoggerService } from '../loggger/logger.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { handleResponseOk } from 'src/utils/api/apiResponseHandle';
//import { LoggerKafkaService } from '../loggger/loggerKafka.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(data: CreateUserDto): Promise<object> {
    const userExists = await this.prisma.users.findMany({
      where: { email: data.email },
    });
    if (userExists.length > 0) {
      this.logger.error('Email is already in use: ' + data.email);
      throw new ConflictException('Email is already in use: ' + data.email);
    }
    try {
      const users = await this.prisma.users.create({
        data: {
          name: data.name,
          email: data.email,

        },
      });
      this.logger.log(
        `${apiBaseEntityName} successfully created: ${JSON.stringify(users)}`,
      );
      return handleResponseOk({ useId: users.id }, "User created successfully", 201)
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException('Error creating user');
    }
  }
  //@Cron(CronExpression.EVERY_10_SECONDS)
  async findAll(limit: string, page: string): Promise<SendData | User[]> {
    const cacheKey = `users`; // Clave única para el caché

    // Verifica si los datos están en caché
    const cachedData = await this.cacheManager.get<SendData | User[]>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return cachedData; // Retorna los datos desde el caché si existen
    }

    // Realiza la consulta a la base de datos si no hay caché
    const total = await this.prisma.users.count();
    const pageQuery = limit && page ? page : (page = '1');
    let dataSend: SendData | User[];

    if (limit) {
      const usersQuery = await this.prisma.users.findMany({
        take: parseInt(limit),
        skip: (parseInt(pageQuery) - 1) * parseInt(limit),
      });
      dataSend = {
        data: usersQuery,
        limit: limit,
        page: page,
        totalPages: Math.ceil(total / parseInt(limit)).toString(),
      };
    } else {
      dataSend = await this.prisma.users.findMany();
    }

    // Almacena los datos en caché
    await this.cacheManager.set(cacheKey, dataSend, 60000); // 60 segundos de tiempo de vida
    this.logger.log(`Cache set for key: ${cacheKey}`);
    
    return cachedData
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.users.findUnique({ where: { id: id } });
      if (user === null) {
        throw new NotFoundException(
          `${apiBaseEntityName} not found for ID: ${id}`,
        );
      }
      return user;
    } catch (e) {
      this.logger.error(e)
      // Aquí puedes lanzar una excepción diferente si es necesario, pero asegurate de que sea NotFoundException
      throw new NotFoundException(
        `${apiBaseEntityName} not found for ID: ${id}`,
      );
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.users.update({
      where: { id: id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.users.delete({ where: { id } });
  }
}
