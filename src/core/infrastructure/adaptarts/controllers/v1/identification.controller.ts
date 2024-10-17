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

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentificationService } from 'src/core/application/services/identification.service';
import { Identification} from 'src/core/domain/identification.entity';
import { apiStatus } from 'src/utils/api/apiStatus';

@ApiTags('/msa/users')
@Controller('/msa')
export class IdentificationController {
  constructor(private typeService: IdentificationService) {}



  @ApiResponse(apiStatus.ok) //200
  @ApiResponse(apiStatus.badRequest) //400
  @ApiResponse(apiStatus.unauthorized) //401
  @ApiResponse(apiStatus.forbidden) //403
  @ApiResponse(apiStatus.internalServerError) //404
  @ApiResponse(apiStatus.methodNotserviceowed)//405
  @ApiResponse(apiStatus.requestTimeout)//408
  @ApiResponse(apiStatus.serviceUnavailable) //409
  @ApiResponse(apiStatus.conflict) //500
  @ApiResponse(apiStatus.notFound) //503
  

  @Get('/retrieveidentificationtypes/1.0')
  @ApiOperation({ summary: 'Retrieves the available identification types'})
  async getAllUsers(): Promise<Pick<Identification, 'name' |'id_type_identification'>[]> {
    return this.typeService.findAll();
  }
}
