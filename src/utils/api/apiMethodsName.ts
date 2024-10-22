import { apiBaseEntityName } from './apiEntites';
import { Validator } from './apiValidations';

//En caso de tener una sola operacion
export const apiMethodsName = {
  get: `Retrieves ${apiBaseEntityName}`,
  post: `Save ${apiBaseEntityName}`,
  put: `Update ${apiBaseEntityName}`,
  patch: `Patch ${apiBaseEntityName}`,
  delete: `Remove ${apiBaseEntityName}`,
  service: `${apiBaseEntityName}`,
  options: `Options ${apiBaseEntityName}`,
  '000': `Exito ${apiBaseEntityName}`,
};
export const setMethodsName = (
  httpMethod:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'SERVICE'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | string,
  apiBaseEntityName: string,
): string => {
  let method;
  if (Validator.isUpperCase(httpMethod)) {
    method = httpMethod.toUpperCase();
  } else {
    method = httpMethod;
  }

  switch (method) {
    case 'GET':
      return `Retrieves ${apiBaseEntityName}`;
    case 'POST':
      return `Save ${apiBaseEntityName}`;
    case 'PUT':
      return `Update ${apiBaseEntityName}`;
    case 'DELETE':
      return `Remove ${apiBaseEntityName}`;
    case 'SERVICE':
      return `Exito ${apiBaseEntityName}`;
    default:
      return `Unknown method for ${apiBaseEntityName}`;
  }
};

export const apiMethods = (methodCase: string, apiBaseEntityName: string) => {
  const method = methodCase.toUpperCase();
  switch (method) {
    case 'GET':
      return setMethodsName(method, apiBaseEntityName);
    case 'POST':
      return setMethodsName(method, apiBaseEntityName);
    case 'PUT':
      return setMethodsName(method, apiBaseEntityName);
    case 'DELETE':
      return setMethodsName(method, apiBaseEntityName);
    case 'SERVICE':
      return setMethodsName(method, apiBaseEntityName);
  }
};
