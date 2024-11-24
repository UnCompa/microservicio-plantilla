export const enablePathMethods = {
  get: [
    '/v1.0/msa/users/1.0', // Ruta normal
    '/v1.0/msa/users/1.0/:id_user',
    '/ruta', // Ruta normal
    '/ruta/:id', // Ruta con parámetro dinámico :id
  ],
  post: ['/v1.0/msa/users/1.0'],
  put: [],
  delete: [],
  patch: [],
};
