export class CargaIngresosEgresos {
    idEntidad: number;
    nombres: string;
    rubro: string;
    valor: number;
    fecha: string;
  
    constructor(data: any) {
      this.idEntidad = data.idEntidad;
      this.nombres = data.nombres;
      this.rubro = data.rubro;
      this.valor = data.valor;
      this.fecha = data.fecha;
    }
  
  }