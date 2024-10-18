interface CustomLog {
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
}

export const messageCustom = (message: string, method?: string) => {
  const dataMessage: CustomLog = {
    //timestamp: new Date().toISOString(),
    amdocs360product: '',
    methodName: method,
  };
  return dataMessage;
};

// const logEntry = {
//   timestamp: new Date().toISOString(),
//   componentType: "Backend",
//   ip: customLog.ip || "172.20.102.187", // Cambia la IP según sea necesario
//   appUser: customLog.appUser || "usrosbnewqabim",
//   channel: customLog.channel || "web",
//   consumer: customLog.consumer || "self service portal",
//   apiName: customLog.apiName || "Nombre del api",
//   microserviceName: customLog.microserviceName || "Nombre Microservicio",
//   methodName: customLog.methodName || "Nombre del metodo ejecutado",
//   layer: customLog.layer || "Exposicion",
//   parentId: customLog.parentId || crypto.randomUUID(),
//   referenceId: customLog.referenceId || crypto.randomUUID(),
//   dateTimeTransacctionStart: customLog.dateTimeTransacctionStart || new Date().toISOString(),
//   dateTimeTransacctionFinish: customLog.dateTimeTransacctionFinish || new Date().toISOString(),
//   executionTime: customLog.executionTime || "tomar el tiempo de ejecución",
//   country: customLog.country || "",
//   city: customLog.city || "",
// };
