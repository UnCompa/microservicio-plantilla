import * as os from 'os';
export const getIp = () => {
  const networkInterfaces = os.networkInterfaces();

  // Verificar si existe la interfaz 'Wi-Fi'
  if (networkInterfaces['Wi-Fi']) {
    if (networkInterfaces['Wi-Fi'].length > 1) {
      return networkInterfaces['Wi-Fi'][1].address;
    } else {
      console.error("No hay suficientes direcciones IP en 'Wi-Fi'.");
      return '0.0.0.0'; // Retorna un valor por defecto
    }
  }

  // Verificar si existe la interfaz 'eth0' (común en contenedores Docker)
  if (networkInterfaces['eth0']) {
    if (networkInterfaces['eth0'].length > 0) {
      return networkInterfaces['eth0'][0].address; // Usar la primera dirección en 'eth0'
    } else {
      console.error("No hay direcciones IP en 'eth0'.");
      return '0.0.0.0'; // Retorna un valor por defecto
    }
  }

  // Verificar si existe la interfaz 'lo' (loopback)
  if (networkInterfaces['lo']) {
    if (networkInterfaces['lo'].length > 0) {
      return networkInterfaces['lo'][0].address;
    } else {
      console.error("No hay suficientes direcciones IP en 'lo'.");
      return '0.0.0.0'; // Retorna un valor por defecto
    }
  }

  console.error('No se encontró ninguna interfaz de red válida.');
  return '0.0.0.0'; // Retorna un valor por defecto
};

export const getUser = () => {
  const infoUser = os.userInfo();
  return infoUser.username;
};
