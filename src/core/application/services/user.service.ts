import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from 'src/core/domain/user.entity';
import { SendData } from '../dtos/sendData-user.dto';
import { apiBaseEntityName } from 'src/utils/api/apiEntites';
import { LoggerService } from '../loggger/logger.service';
import { apiMethodsName } from 'src/utils/api/apiMethodsName';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

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
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException('Error creating user');
    }
    return { message: apiMethodsName['000'] };
  }

  async findAll(limit: string, page: string): Promise<SendData | User[]> {
    this.logger.debug('NOSE XD');
    const total = await this.prisma.users.count();
    const pageQuery = limit && page ? page : (page = '1');
    if (limit) {
      const usersQuery = await this.prisma.users.findMany({
        take: parseInt(limit),
        skip: (parseInt(pageQuery) - 1) * parseInt(limit),
      });
      const dataSend = {
        data: usersQuery,
        limit: limit,
        page: page,
        totalPages: Math.ceil(total / parseInt(limit)).toString(),
      };
      this.logger.log(JSON.stringify({ total: 'Total de registro: ' + total }));
      return dataSend;
    } else {
      const users = await this.prisma.users.findMany();
      this.logger.log(JSON.stringify('Total de registro: ' + total));
      return users;
    }
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
    } catch (error) {
      // Aquí puedes lanzar una excepción diferente si es necesario, pero asegurate de que sea NotFoundException
      throw new NotFoundException(
        `${apiBaseEntityName} not found for ID: ${id}` + error,
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
