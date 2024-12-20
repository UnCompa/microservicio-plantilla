import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckDatabaseConnectionGuard } from 'src/core/application/decorators/checkDatabase.decorator';
import { CreateUserDto } from 'src/core/application/dtos/create-user.dto';
import { SendData } from 'src/core/application/dtos/sendDataUser.dto';
import { UpdateUserDto } from 'src/core/application/dtos/updateUser.dto';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { UserService } from 'src/core/application/services/user.service';
import { User } from 'src/core/domain/user.entity';
import { Validator } from 'src/utils/api/apiValidations';

@ApiTags('/msa/users')
@Controller()
@UseGuards(CheckDatabaseConnectionGuard)
//@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}
  @Post('/msa/users/1.0')
  @HttpCode(201)
  async createUser(@Body() data: CreateUserDto): Promise<object> {
    return this.userService.create(data);
  }

  @Get('/msa/users/1.0')
  async getAllUsers(@Query() params): Promise<SendData | User[]> {
    const { limit, page } = params;
    return this.userService.findAll(limit, page);
  }

  @Get('/msa/users/1.0/:id_user')
  async getOneUser(@Param('id_user') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.findOne(id);
  }
  @Get('/msa/users/2.0/:id')
  async getOneProducts(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.findOne(id);
  }

  @Put('/msa/users/1.0/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.update(id, data);
  }

  @Delete('/msa/users/1.0/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.delete(id);
  }
}
