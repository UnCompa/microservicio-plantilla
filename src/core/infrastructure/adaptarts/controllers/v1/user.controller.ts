import {
  All,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MethodNotAllowedException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/core/application/dtos/create-user.dto';
import { SendData } from 'src/core/application/dtos/sendData-user.dto';
import { UpdateUserDto } from 'src/core/application/dtos/update-user.dto';
import { UserService } from 'src/core/application/services/user.service';
import { User } from 'src/core/domain/user.entity';
import { apiStatus } from 'src/utils/api/apiStatus';
import { Validator } from 'src/utils/api/apiValidations';

@ApiTags('/msa/users')
@Controller('/msa/users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiResponse(apiStatus.ok)
  @ApiResponse(apiStatus.badRequest)
  @ApiResponse(apiStatus.conflict)
  @ApiResponse(apiStatus.notFound)
  @Post('1.0')
  @HttpCode(201)
  async createUser(@Body() data: CreateUserDto): Promise<object> {
    return this.userService.create(data);
  }

  @Get('1.0')
  async getAllUsers(@Query() params): Promise<SendData | User[]> {
    const { limit, page } = params;
    return this.userService.findAll(limit, page);
  }

  @Get('1.0/:id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.findOne(id);
  }

  @Put('1.0/:id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.update(id, data);
  }

  @Delete('1.0/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.delete(id);
  }

  // Capture unsupported methods for specific routes !Not deleted
/*   @All('1.0')
  @HttpCode(405)
  handleMethodNotAllowedGeneral() {
    throw new MethodNotAllowedException(
      'Method not allowed on this route. Allowed methods: POST, GET.'
    );
  } */
}
