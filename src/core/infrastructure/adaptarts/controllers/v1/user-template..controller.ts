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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/core/application/dtos/create-user.dto';
import { SendData } from 'src/core/application/dtos/sendData-user.dto';
import { UpdateUserDto } from 'src/core/application/dtos/update-user.dto';
import { UserService } from 'src/core/application/services/user.service';
import { User } from 'src/core/domain/user.entity';
import { apiStatus, createEntity } from 'src/utils/api/apiStatus';
import { Validator } from 'src/utils/api/apiValidations';

@ApiTags('pathDeTuServicio')
@Controller('pathDeTuServicio')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiResponse(apiStatus.ok)
  @ApiCreatedResponse(createEntity)
  @Post('path')
  @HttpCode(201)
  async createUser(@Body() data: CreateUserDto): Promise<object> {
    return this.userService.create(data);
  }

  @ApiResponse(apiStatus.ok)
  @Get('path')
  async getAllUsers(@Query() params): Promise<SendData | User[]> {
    const { limit, page } = params;
    return this.userService.findAll(limit, page);
  }
  @ApiResponse(apiStatus.ok)
  @ApiResponse(apiStatus.notFound)
  @Get('path/:id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.findOne(id);
  }
  @ApiResponse(apiStatus.notFound)
  @ApiResponse(apiStatus.badRequest)
  @Put('path/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.update(id, data);
  }
  @ApiResponse(apiStatus.notFound)
  @Delete('path/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    if (!Validator.isValidUUID(id)) {
      throw new BadRequestException('The "id" parameter must be a valid UUID.');
    }
    return this.userService.delete(id);
  }
}
