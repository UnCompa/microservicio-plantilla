import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from 'src/core/domain/user.entity';
import { SendData } from '../dtos/sendDataUser.dto';
import { apiBaseEntityName } from 'src/utils/api/apiEntites';
import { LoggerService } from '../loggger/logger.service';
import { apiMethodsName } from 'src/utils/api/apiMethodsName';
//import { LoggerKafkaService } from '../loggger/loggerKafka.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private logger: LoggerService,
  ) {}

  async register(data: any, token: string) {
    const url = 'http://localhost:8080/admin/realms/MICHIMONEY/users';
    try {
      const res = await firstValueFrom(
        this.http.post(url, data, { headers: { Authorization: token } }).pipe(
          catchError((error: any) => {
            if (error.response.data.error) {
              throw new UnauthorizedException('No autorizado, token invalido');
            }
            throw new ConflictException(
              'Error: ' + JSON.stringify(error.response.data),
            );
          }),
        ),
      );

      return res.data; // Puedes retornar lo que obtienes de la respuesta
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }
  async login(data: any) {
    const url =
      'http://localhost:8080/realms/MICHIMONEY/protocol/openid-connect/token';
    const params = new URLSearchParams();
    params.append('client_secret', 'cWBFSs49Zp5cSOdvTv25KMLgYIQgXJIF');
    params.append('grant_type', 'password');
    params.append('client_id', 'mi-app');
    params.append('scope', 'openid');
    params.append('username', data.username);
    params.append('password', data.password);
    try {
      const res = await firstValueFrom(
        this.http.post(url, params).pipe(
          catchError((error: any) => {
            throw new ConflictException(
              'Error: ' + JSON.stringify(error.response.data),
            );
          }),
        ),
      );

      return res.data; // Puedes retornar lo que obtienes de la respuesta
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }
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
    } catch (e) {
      this.logger.error(e);
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
