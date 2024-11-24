import { setMethodsName } from './apiMethodsName';
import { apiBaseEntityName } from './apiEntites';
import { getIp, getUser } from './apiUtilities';

//Configurar el formato
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
  message: string | object,
  method?: string,
  entity?: string,
  level?: string,
  duration?: string,
  appUser?: string,
): CustomLog => {
  const currentTimestamp = new Date().toISOString();
  const microserviceName = apiBaseEntityName ?? setMethodsName(method, entity);
  const dataMessage: CustomLog = {
    timestamp: currentTimestamp,
    level: `[${level.toUpperCase()}]`,
    message: message as string,
    componentType: 'Backend',
    ip: kafkaConfigFormat.ip, // Obtener la IP de la máquina local o una IP predeterminada
    channel: 'web',
    consumer: 'self service portal',
    apiName: kafkaConfigFormat.apiName,
    microserviceName: microserviceName,
    methodName: method || kafkaConfigFormat.method.get,
    layer: 'Exposicion',
    dateTimeTransacctionStart: currentTimestamp,
    dateTimeTransacctionFinish: currentTimestamp, // Por defecto el tiempo de finalización es el mismo que el inicio
    country: kafkaConfigFormat.country,
    city: kafkaConfigFormat.city,
    parentId: kafkaConfigFormat.parentId,
    referenceId: kafkaConfigFormat.referenceId,
  };
  dataMessage.executionTime = duration
    ? `${duration}ms`
    : new Date().toISOString(); // Tiempo en milisegundos
  dataMessage.appUser = appUser ? appUser : getUser(); // Tiempo en milisegundos
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
