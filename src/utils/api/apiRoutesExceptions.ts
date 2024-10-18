import { apiBaseEntityName, apiBaseEntityName2 } from './apiEntites';

export const routesExceptions = {
  notFound: [
    {
      method: 'DELETE',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName,
    },
    {
      method: 'PUT',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName2,
    },
    {
      method: 'POST',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName,
    },
    {
      method: 'POST',
      path: '/msa/users/2.0',
      entity: apiBaseEntityName2,
    },
  ],
  badRequest: [
    {
      method: 'DELETE',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName,
    },
    {
      method: 'PUT',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName2,
    },
    {
      method: 'POST',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName2,
    },
  ],
  forbidden: [],
  unauthorized: [], // Arreglo vacío para Unauthorized
  serviceUnavailable: [], // Arreglo vacío para Service Unavailable
  conflict: [], // Arreglo vacío para Conflict
  internalServerError: [], // Arreglo vacío para Internal Server Error
  methodNotAllowed: [
    {
      method: 'POST',
      path: '/msa/users/1.0',
      entity: apiBaseEntityName2,
    },
    {
      method: 'POST',
      path: '/msa/users/2.0',
      entity: apiBaseEntityName2,
    },
  ],
  // Agrega más estados según sea necesario
};
