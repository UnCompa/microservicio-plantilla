import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/core/domain/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SendData } from '../dtos/sendDataUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { LoggerService } from '../loggger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
//import { LoggerKafkaService } from '../loggger/loggerKafka.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private logger: LoggerService, private i18n: I18nService) {}
  async findAll(limit: string, page: string): Promise<SendData | User[]> {
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

  async create(data: CreateUserDto): Promise<object> {
    const userExists = await this.prisma.users.findMany({
      where: { email: data.email },
    });
    if (userExists.length > 0) {
      const errorMessage = await this.i18n.translate('common.EMAIL_IN_USE', {
        args: { email: data.email }, // Asegúrate de que "email" es la clave en el archivo de traducción
      });
      console.log(errorMessage);
      
      throw new ConflictException(errorMessage);
    }
    try {
      const users = await this.prisma.users.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
      const successMessage = await this.i18n.translate(
        'common.USER_CREATED_SUCCESS',
      );
      return { message: successMessage, userId: users.id };
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      const errorMessage = await this.i18n.translate('common.USER_NOT_FOUND', {
        args: { id },
      });
      throw new NotFoundException(errorMessage);
    }
    return user;
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
