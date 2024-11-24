// apiSwaggerConfig.ts
import { DocumentBuilder } from '@nestjs/swagger';

export const apiSwaggerConfig = (mode: string) => {
  const isProd = mode === 'production'; // Si el modo es producción

  const servers = [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
    {
      url: 'https://miapp.com',
      description: 'Servidor de producción',
    },
  ];

  // Si no es producción, puedes agregar más servidores o modificar la lista
  if (!isProd) {
    servers.push({
      url: 'http://localhost:4000', // Un servidor adicional de desarrollo
      description: 'Servidor de pruebas',
    });
  }

  // Construir la configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('User Microservicie')
    .setDescription(`Microservicio de usuario para el modo ${mode}`)
    .setVersion('1.0');

  // Agregar los servidores dinámicamente
  servers.forEach(server => {
    config.addServer(server.url, server.description);
  });

  return config.build();
};
