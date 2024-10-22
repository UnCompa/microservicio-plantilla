import * as os from 'os';
import { setMethodsName } from './apiMethodsName';
import { apiBaseEntityName } from './apiEntites';

export const getIp = () => {
  const networkInterfaces = os.networkInterfaces();
  return networkInterfaces['Wi-Fi'][1].address;
};
const kafkaConfigFormat = {
  appUser: 'Brandon',
  apiName: 'Users',
  country: 'Ecuador',
  city: 'Quito',
  ip: getIp(),
  parentId: '',
  referenceId: '',
  method: {
    get: 'GET',
  },
};

export const messageCustom = (
  message: string,
  method?: string,
  entity?: string,
  level?: string,
): CustomLog => {
  const currentTimestamp = new Date().toISOString();
  const nose = apiBaseEntityName ?? setMethodsName(method, entity);
  const startTime = Date.now(); // Tiempo de inicio en milisegundos
  const dataMessage: CustomLog = {
    timestamp: currentTimestamp,
    level: `[${level.toUpperCase()}]`,
    message: message,
    componentType: 'Backend',
    ip: kafkaConfigFormat.ip, // Obtener la IP de la máquina local o una IP predeterminada
    appUser: kafkaConfigFormat.appUser,
    channel: 'web',
    consumer: 'self service portal',
    apiName: kafkaConfigFormat.apiName,
    microserviceName: nose,
    methodName: method || kafkaConfigFormat.method.get,
    layer: 'Exposicion',
    dateTimeTransacctionStart: currentTimestamp,
    dateTimeTransacctionFinish: currentTimestamp, // Por defecto el tiempo de finalización es el mismo que el inicio
    country: kafkaConfigFormat.country,
    city: kafkaConfigFormat.city,
    parentId: kafkaConfigFormat.parentId,
    referenceId: kafkaConfigFormat.referenceId,
  };

  const endTime = Date.now(); // Tiempo de finalización en milisegundos
  const executionTime = (endTime - startTime).toString(); // Calcula el tiempo de ejecución

  // Agregar tiempo de finalización y tiempo de ejecución
  dataMessage.dateTimeTransacctionFinish = new Date().toISOString();
  dataMessage.executionTime = `${executionTime}ms`; // Tiempo en milisegundos

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
