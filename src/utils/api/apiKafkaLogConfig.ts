import * as os from 'os';
import * as crypto from 'crypto';
import { setMethodsName } from './apiMethodsName';
import { apiBaseEntityName } from './apiEntites';
const kafkaConfigFormat = {
  appUser: 'Brandon',
  apiName: 'Users',
  microserviceName: 'Users',
  country: 'Ecuador',
  city: 'Quito',
};

const getLocalIP = (): string | undefined => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    if (networkInterface) {
      for (const iface of networkInterface) {
        // Filtramos solo las direcciones IPv4 no internas (que no son loopback)
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  return '192.168.681.131'; // IP por defecto si no se encuentra una dirección válida
};

export const messageCustom = (
  message: string,
  method?: string,
  entity?: string,
  level?: string,
): CustomLog => {
  let methodApi;
  if (entity && method) {
    methodApi = setMethodsName(method, entity);
  } else {
    methodApi = apiBaseEntityName;
  }

  const currentTimestamp = new Date().toISOString();
  const startTime = Date.now(); // Tiempo de inicio en milisegundos
  const dataMessage: CustomLog = {
    timestamp: currentTimestamp,
    level: `[${level.toUpperCase()}]`,
    message: message,
    componentType: 'Backend',
    ip: getLocalIP(), // Obtener la IP de la máquina local o una IP predeterminada
    appUser: kafkaConfigFormat.appUser,
    channel: 'web',
    consumer: 'self service portal',
    amdocs360product: 'gg',
    apiName: kafkaConfigFormat.apiName,
    microserviceName: kafkaConfigFormat.microserviceName,
    methodName: methodApi || 'Nombre del metodo ejecutado',
    layer: 'Exposicion',
    parentId: crypto.randomUUID(),
    referenceId: crypto.randomUUID(),
    dateTimeTransacctionStart: currentTimestamp,
    dateTimeTransacctionFinish: currentTimestamp, // Por defecto el tiempo de finalización es el mismo que el inicio
    executionTime: 'tomar el tiempo de ejecución',
    country: kafkaConfigFormat.country,
    city: kafkaConfigFormat.city,
  };

  const endTime = Date.now(); // Tiempo de finalización en milisegundos
  const executionTime = (endTime - startTime).toString(); // Calcula el tiempo de ejecución

  // Agregar tiempo de finalización y tiempo de ejecución
  dataMessage.dateTimeTransacctionFinish = new Date().toISOString();
  dataMessage.executionTime = executionTime; // Tiempo en milisegundos

  return dataMessage;
};

interface CustomLog {
  timestamp?: string;
  level?: string;
  message?: string;
  ip?: string;
  appUser?: string;
  channel?: string;
  consumer?: string;
  amdocs360product?: string;
  apiName?: string;
  microserviceName?: string;
  methodName?: string;
  layer?: string;
  parentId?: string;
  referenceId?: string;
  dateTimeTransacctionStart?: string;
  dateTimeTransacctionFinish?: string;
  executionTime?: string;
  country?: string;
  city?: string;
  componentType?: string;
}

// const logEntry = {
//   timestamp: new Date().toISOString(),
//   componentType: 'Backend',
//   ip: customLog.ip || '172.20.102.187', // Cambia la IP según sea necesario
//   appUser: customLog.appUser || 'usrosbnewqabim',
//   channel: customLog.channel || 'web',
//   consumer: customLog.consumer || 'self service portal',
//   apiName: customLog.apiName || 'Nombre del api',
//   microserviceName: customLog.microserviceName || 'Nombre Microservicio',
//   methodName: customLog.methodName || 'Nombre del metodo ejecutado',
//   layer: customLog.layer || 'Exposicion',
//   parentId: customLog.parentId || crypto.randomUUID(),
//   referenceId: customLog.referenceId || crypto.randomUUID(),
//   dateTimeTransacctionStart: customLog.dateTimeTransacctionStart || new Date().toISOString(),
//   dateTimeTransacctionFinish: customLog.dateTimeTransacctionFinish || new Date().toISOString(),
//   executionTime: customLog.executionTime || 'tomar el tiempo de ejecución',
//   country: customLog.country || ',
//   city: customLog.city || ',
// };
