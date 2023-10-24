export interface AdjuntosGenerales {
  nombreSeccion: string;
  adjuntosList: AdjuntosList[];
}

export interface AdjuntosList {
  idPrestamo?: any;
  nombreAdjunto: string;
  dataSave: DataSave;
  esRequerido: boolean;
  multiple: boolean;
  visualizationMode: boolean;
  idTipoAdjunto?: number;
  adjuntos?: AdjuntoGeneral[];
  mimeType?:string;
  name?:string;
}

export interface AdjuntosLocal {
  idPrestamo?: any;
  nombreAdjunto: string;
  esRequerido: boolean;
  multiple: boolean;
  visualizationMode: boolean;
  idTipoAdjunto?: number;
  adjuntos: AdjuntoLocal[];
  mimeType?:string;
  name?:string;
}


export interface AdjuntoLocal {
  dataSave: DataSave;
  adjunto: AdjuntoGeneral;
}


export interface DataSave {
  name?: string;
  adjunto?: string;
  mimeType?: string;
  tipoAdjunto?: number;
  idReferenciaPersonal?: number;
  idReferenciaBancaria?: number;
  idFormacionAcademica?: number;
  idVehiculo?: number;
  observaciones: string;
  idEstado?: true;
  idPrestamo?: number;
  idInversion?: number;
  idTicket?: number;
  idComentario?: number;
  idCesantia?: number;
  blob?:Blob;
}

export interface AdjuntoGeneral {
  nombreTipoAdjunto: string;
  idReferenciaPersonal?: number;
  idReferenciaBancaria?: number;
  idFormacionAcademica?: number;
  idVehiculo?: number;
  idEstado?: boolean;
  idAdjunto: number;
  idEntidad?: number;
  idPrestamo?: number;
  idInversion?: number;
  tipoAdjunto: number;
  idTicket?: number;
  idComentario?: number;
  idCesantia?: number;
  url?: string;
  path?: string;
  name: string;
  mimeType: string;
  observaciones?: string;
}


export interface AdjuntoVacaciones {
  motivo?: string;
}