import { apiBaseEntityName } from './apiEntites';

export const apiMethodsName = {
  get: `Retrieves ${apiBaseEntityName}`,
  post: `Save ${apiBaseEntityName}`,
  put: `Update ${apiBaseEntityName}`,
  delete: `Remove ${apiBaseEntityName}`,
  service: `${apiBaseEntityName}`,
  '000': `Exito ${apiBaseEntityName}`,
};
export const setMethodsName = (method, apiBaseEntityName) => {
  if (method === 'GET') {
    return `Retrieves ${apiBaseEntityName}`;
  }
  if (method === 'POST') {
    return `Save ${apiBaseEntityName}`;
  }
  if (method === 'PUT') {
    return `Update ${apiBaseEntityName}`;
  }
  if (method === 'DELETE') {
    return `Remove ${apiBaseEntityName}`;
  }
  if (method === 'SERVICE') {
    return `Exito ${apiBaseEntityName}`;
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
    default:
      return setMethodsName(method, apiBaseEntityName);
  }
};
