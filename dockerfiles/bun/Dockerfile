# Etapa 1: Instalación de dependencias
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copiar package.json y bun.lockb
COPY package.json bun.lockb ./

# Instalar dependencias de producción
RUN bun install --prod

# Copiar solo la carpeta prisma para generar el cliente
COPY prisma ./prisma
RUN npx prisma generate

# Etapa 2: Instalación de NestJS CLI y construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar el código fuente
COPY . .

# Instalar el NestJS CLI solo para la compilación
RUN npm install @nestjs/cli --production

# Compilar la aplicación NestJS
RUN npm run build

# Eliminar NestJS CLI después de la compilación
RUN npm uninstall @nestjs/cli

# Etapa 3: Imagen de producción mínima
FROM node:18-alpine AS production

WORKDIR /app

# Copiar lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

# Definir variables de entorno para producción
ENV NODE_ENV=production

# Exponer el puerto para la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]

# Configuración de healthcheck (opcional)
HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1
