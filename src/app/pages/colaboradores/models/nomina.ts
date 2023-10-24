export interface NominaNoProcesada {
  completed?:boolean;
  idNominaCabecera: number;
  idColaborador: number;
  idCargaNomina: number;
  idEntidad: number;
  fechaRegistro?: string;
  esValido?: boolean;
  fechaNomina?:Date;
  nominaDetalle:DetalleNominaNoProcesada[];
  idTipoColaborador:number
}

export interface DetalleNominaNoProcesada {
  idNominaCabecera?: number;
  idTipoRubro?: number;
  monto: number;
  periodo?:number;
  rubro: string;
  tipoMovimiento?: string;
  idEstado?: boolean;
}

export interface DetalleListadoNominaNoProcesada {
  decimal:DetalleNominaNoProcesada[];
  unidad:DetalleNominaNoProcesada[];
  total:DetalleNominaNoProcesada;
}