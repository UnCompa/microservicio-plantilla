//Definir entidad para la logica de negocio
export class Identification {
  id_type_identification : string;
  name: string;
  users: any[];
  constructor(id_type_identification : string, name: string) {
    this.id_type_identification  = id_type_identification ;
    this.name = name;
  }
}
