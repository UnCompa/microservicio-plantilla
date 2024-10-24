import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/core/application/dtos/create-user.dto';
import { SendData } from 'src/core/application/dtos/sendDataUser.dto';
import { UpdateUserDto } from 'src/core/application/dtos/updateUser.dto';
import { PrismaService } from 'src/core/application/prisma/prisma.service';
import { UserService } from 'src/core/application/services/user.service';
import { CheckDatabaseConnectionGuard } from 'src/core/application/decorators/checkDatabase.decorator';
import { User } from 'src/core/domain/user.entity';
import { Validator } from 'src/utils/api/apiValidations';
import { AuthGuard } from 'src/core/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  @Get('/msa/users/1.0')
  async getAllUsers(@Query() params): Promise<SendData | User[]> {
    const { limit, page } = params;
    return this.userService.findAll(limit, page);
  }
  @Post('/msa/users/register/1.0')
  async registerUser(@Body() data , @Headers() headers ): Promise<string> {
    const { authorization } = headers
    return this.userService.register(data, authorization);
  }
  @Post('/msa/users/login/1.0')
  async loginUser(@Body() data , @Headers() headers ): Promise<string> {
    const { authorization } = headers
    return this.userService.login(data, authorization);
  }

  @Get('/msa/users/1.0/:id')
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
