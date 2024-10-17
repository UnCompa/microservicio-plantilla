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

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/core/application/services/identification.service';
import { Identification} from 'src/core/domain/identification.entity';
import { apiStatus } from 'src/utils/api/apiStatus';

@ApiTags('/msa/users')
@Controller('/msa')
export class UserController {
  constructor(private userService: UserService) {}



  @ApiResponse(apiStatus.ok)
  @ApiResponse(apiStatus.badRequest)
  @ApiResponse(apiStatus.unauthorized)
  @ApiResponse(apiStatus.forbidden)
  @ApiResponse(apiStatus.internalServerError)
  @ApiResponse(apiStatus.serviceUnavailable)
  @ApiResponse(apiStatus.conflict)
  @ApiResponse(apiStatus.notFound)
  

  @Get('/retrieveidentificationtypes/1.0')
  async getAllUsers(): Promise<Identification[]> {
    return this.userService.findAll();
  }
}
