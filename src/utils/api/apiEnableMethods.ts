export const enablePathMethods = {
  get: [
    '/v1.0/msa/users/1.0', // Ruta normal
    '/v1.0/msa/users/1.0/:id_user',
    '/v1.0/health', // Ruta normal
    '/v1.0', // Ruta con parámetro dinámico :id
  ],
  post: ['/v1.0/msa/users/1.0'],
  put: [],
  delete: [],
  patch: [],
};
