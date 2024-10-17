export const enablePathMethods = {
  get: [
    '/msa/users/1.0/:id', // Ruta con parámetro dinámico :id
    '/msa/users/1.0', // Ruta con parámetro dinámico :id
  ],
  post: ['/msa/users/1.0', '/msa/users/2.0'],
  put: [
    '/msa/users/1.0/:id', // Ruta con parámetro dinámico :id
    '/msa/users/2.0', // Ruta con parámetro dinámico :id
    '/msa/users/1.0', // Ruta con parámetro dinámico :id
  ],
};
