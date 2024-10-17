import { apiBaseEntityName } from './apiBaseEntities';
import { apiMethodsName } from './apiMethodsName';

export const apiExceptionConfig = {
  notFound: {
    code: 'Not Found',
    message: `${apiBaseEntityName} not found`,
    timestamp: new Date().toISOString(),
    service: apiMethodsName.get,
    example: {
      code: 'Not Found',
      message: `${apiBaseEntityName} not found`,
      timestamp: new Date().toISOString(),
      service: apiMethodsName.get,
    },
    routes: [
      { method: 'DELETE', path: '/msa/identificationtypes/1.0' },
      { method: 'PUT', path: '/msa/identificationtypes/1.0' },
      // Agrega más rutas aquí
    ],
  },
  badRequest: {
    code: 'Bad Request',
    message: 'Bad request due to invalid syntax or parameters',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Bad Request',
      message: 'Invalid parameters were provided',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  methodNotAllowed: {
    code: 'Method Not Allowed',
    message: 'Method Not Allowed',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Method Not Allowed',
      message: 'The method is not allowed for this endpoint',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  unauthorized: {
    code: 'Unauthorized',
    message: 'Authentication is required and has failed or not been provided',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Unauthorized',
      message: 'Authentication failed or not provided',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  forbidden: {
    code: 'Forbidden',
    message: 'Access to the resource is forbidden',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Forbidden',
      message: 'You do not have permission to access this resource',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  conflict: {
    code: 'Conflicting',
    message: 'A conflict occurred due to duplicate data or conflicting state',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Conflicting',
      message: 'Duplicate or conflicting data found',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  internalServerError: {
    code: 'Internal Server Error',
    message: 'Internal server error occurred while processing the request',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Internal Server Error',
      message: 'An unexpected error occurred on the server',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  serviceUnavailable: {
    code: 'Unavailable',
    message: 'Service is currently unavailable',
    timestamp: new Date().toISOString(),
    service: 'User Service',
    example: {
      code: 'Unavailable',
      message: 'The service is temporarily unavailable, please try again later',
      timestamp: new Date().toISOString(),
      service: 'User Service',
    },
  },
  validation: {
    routes: {
      put: {
        path: '/msa/identificationtypes/1.0',
        requiredParams: ['id'],
      },
      delete: {
        path: '/msa/identificationtypes/1.0',
        requiredParams: ['id'],
      },
      // Agrega más métodos y rutas para validaciones aquí
    },
  },
  // Sección para agregar más configuraciones según sea necesario
};
