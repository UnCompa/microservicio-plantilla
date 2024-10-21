//Definir entidad para la logica de negocio
export class User {
  id?: string;
  name: string;
  email: string;
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
