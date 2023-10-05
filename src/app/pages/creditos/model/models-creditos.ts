
export interface SimulacionCredito {
  idParticipe: number;
  idProducto: number;
  fechaInicio: string;
  plazo: number;
  tipoAmortizacion: string;
  montoSolicitado: number;
  garantes: GaranteCreditos[];
  garantias: Garantia[];
  prestamos: number[];
  descuentoMora?: number;
  intereses?:number;
}


export interface SolicitudCredito {
  idParticipe: number;
  fecha: string;
  fechaActualizacion: string;
  plazo: number;
  idProducto: number;
  tipoAmortizacion: string;
  montoSolicitado: number;
  valorCuota: number; 
  motivoPrestamo: string;
  comentarios: string;
  idProveedor?: number;
  garantias: Garantia[];
  garantes: GaranteCreditos[];
  prestamos: number[];
  observaciones: string;
  descuentoMora?: number;
  interesVariable?:number;
}


export interface EstadisticasSimulacionCredito {
  totalPrestamo: number;
  totalInteres: number;
  totalCapital: number;
  cuotas: number;
  tasa: number; 
  tasaEfectiva: number;
  tasaNominal:number;
  tasaefectiva:number;
  totalDesgravamen:number;
  descuentoInteres?:number;
  valorDiferido?:number;
}
export interface Garantia {
  idPersona: number;
  idTipoGarantia: number;
  montoGarantia: number;
  descripcion: string;
  valor: number;
  porcentajeGarantia: number;
  ubicacion: string;
  idProvincia?: number;
  idCanton?: number;
  fechaAvaluo?: string;
  fechaContable?: string;
  numeroRegistral: string;
  observaciones: string;
}


export interface ProductosFinancieros {
  idProducto: number,
  codigoSbs: string,
  descripcion: string,
  tasa: number,
  idEstado: boolean,
  idEmpresa: number
}

export interface ValidacionSimulacion {
  descripcion: string,
  ignorar: boolean,
  observaciones: string,
  valido: boolean,
}

export interface Garante {
  idPersona:string | number,
  identificacion?: string,
  montoGarantia: number,
  observaciones: string,
  adjuntoFrontal:any,
  adjuntoPosterior:any,
  adjuntoRol:any
}


export interface GaranteCreditos {
  idPersona:string | number,
  montoGarantia: number,
  observaciones: string,
}


export interface GaranteRequest {
  idEntidad:number,
  idPrestamo:number,
  cuentaIndividual: number,
  identificacion: string,
  razonSocial:string,
}