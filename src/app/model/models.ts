import { DateTimeFormatOptions } from "luxon";
import { Observable, of, ReplaySubject } from "rxjs";
import { Garante, Garantia } from "../pages/creditos/model/models-creditos";

export interface ProductosFinancieros {
  idProducto?: number;
  codigoSbs?: string;
  descripcion?: string;
  tasa?: 0;
  imagen?: string;
  idEstado?: true;
  idEmpresa?: 1;
}

export interface PostAdjunto {
  tipoAdjunto: number;
  adjunto: string;
  name: string;
  mimeType: string;
  observaciones?: string;
  idVehiculo?: number;
  idReferenciaPersonal?: number;
  idReferenciaBancaria?: number;
  idFormacionAcademica?: number;
  idEstado?: boolean;
  size?: number;
  idPrestamo?: number;
  idInversion?: number;
  idTicket?: number;
  idComentario?: number;
  idCesantia?: number;
}

export interface Participe {
  idParticipe?: number;
  idTipoIdentificacion?: number;
  tipoIdentificacion?: string;
  identificacion?: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  fechaRegistro?: Date;
  fechaModificacion?: Date;
  usuarioRegistro?: string;
  usuarioModificacion?: string;
  estado?: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  idNacionalidad?: number;
  fechaExpedicionCedula?: string;
  correo1?: string;
  correo2?: string;
  telefono1?: string;
  telefono2?: string;
  celular?: string;
  idGenero?: number;
  idEstadoCivil?: number;
  idProfesion?: number;
  idGrado?: number;
  photoUrl?: string;
  codigoUniformado?: string;
  fechaIngreso?: Date;
  fechaInicio?: Date;
  aporteAdicional?: number;
  observaciones?: string;
  token?: string;
  identificacionConyuge?: string;
  conyuge?: string;
  idTipoVivienda?: number;
  tiempoResidencia?: number;
  idNivelEstudios?: number;
  idNivelIngresos?: number;
  actividadEconomica?: string;
  nacionalidad?: string;
  genero?: string;
  estadoCivil?: string;
  nivelEstudios?: string;
  nivelIngresos?: string;
  profesion?: string;
  grado?: string;
  tipoVivienda?: string;
  calificacionCredito?: string;
  foto?: string;
  perfilEconomico?: PerfilEconomico;
  garantes?: Garante[];
  contratos?: Contrato[];
  contactos?: Contacto[];
  direcciones?: Direccione[];
  referenciasPersonales?: ReferenciasPersonale[];
  referenciasBancarias?: ReferenciasBancaria[];
}

export interface Contacto {
  nombre?: string;
  telefono?: string;
  correo?: string;
  celular?: string;
  idContacto?: number;
  idEntidad?: number;
}

export interface Encargado {
  idEncargado: number;
  idEntidad: number;
  idDepartamento: number;
  idEstado: boolean;
}

export interface Contrato {
  idContrato?: number;
  idEntidad?: number;
  fechaInicio?: Date;
  porcentajeAporte?: number;
  idRelacionLaboral?: number;
  observaciones?: string;
  estado?: string;
  aporteIndividual?: number;
  aporteAdicional?: number;
  fechaTerminacion?: Date;
  motivoTerminacion?: number;
  identificacion?: string;
  nombre?: string;
}

export interface Direccione {
  idDireccion?: number;
  tipoDireccion?: string;
  idEntidad?: number;
  idPais?: number;
  pais?: string;
  idProvincia?: number;
  provincia?: string;
  idCanton?: number;
  canton?: string;
  idParroquia?: number;
  parroquia?: string;
  callePrincipal?: string;
  calleSecundaria?: string;
  referencia?: string;
}

export interface ReferenciasBancaria {
  idReferenciaBancaria?: number;
  idEntidad?: number;
  identificacion?: string;
  nombre?: string;
  idEntidadFinanciera?: number;
  entidadFinanciera?: string;
  idTipoCuenta?: number;
  tipoCuenta?: string;
  numeroCuenta?: string;
  adjunto?: string;
}

export interface ReferenciasPersonale {
  nombres?: string;
  telefono?: string;
  idReferenciaPersonal?: number;
  idEntidad?: number;
}

export interface Solicitud {
  fecha?: string;
  plazo?: number;
  idTipoPlazo?: string;
  tipoAmortizacion?: string;
  correo1?: string;
  correo2?: string;
  telefono1?: string;
  telefono2?: string;
  celular?: string;
  idGenero?: number;
  idEstadoCivil?: number;
  idNivelEstudios?: number;
  idNivelIngresos?: number;
  idActividadEconomica?: number;
  profesion?: string;
  idGrado?: number;
  identificacionConyuge?: string;
  conyuge?: string;
  idTipoVivienda?: number;
  tiempoResidencia?: number;
  idPais?: number;
  idProvincia?: number;
  idCanton?: number;
  idParroquia?: number;
  callePrincipal?: string;
  calleSecundaria?: string;
  referencia?: string;
  fechaIngreso?: string;
  salarioFijo?: any;
  salarioVariable?: any;
  origenOtrosIngresos?: any;
  otrosIngresos?: any;
  totalIngresos?: any;
  gastosMensuales?: any;
  salarioNeto?: any;
  totalBienes?: any;
  totalVehiculos?: any;
  totalOtrosActivos?: any;
  totalActivos?: any;
  totalDeudas?: any;
  patrimonioNeto?: any;
  rolPagos?: string;
  perfilEconomico?: {
    salarioFijo?: any;
    salarioVariable?: any;
  };
  contactos?: [
    {
      nombre?: string;
      telefono?: string;
      correo?: string;
      celular?: string;
    }
  ];
  referenciasPersonales?: [
    {
      nombres?: string;
      telefono?: string;
    }
  ];
  referenciasBancarias?: [
    {
      idEntidadFinanciera?: number;
      numeroCuenta?: string;
      idTipoCuenta?: number;
      adjunto?: string;
    }
  ];
}
export interface SolicitudPrestamo {
  idParticipe?: number;
  fecha?: string;
  plazo?: number;
  idProducto?: number;
  tipoAmortizacion?: string;
  montoSolicitado?: number;
  valorCuota?: number;
  idProveedor?: number;
  motivoPrestamo?: string;
  comentarios?: string;
  garantias?: Garantia[];
  garantes?: Garante[];
}

export interface InfoBancarios {
  idEntidadFinanciera?: number;
  idTipoCuenta?: number;
  institucion?: string;
  tipoCuenta?: string;
  numeroCuenta?: number;
  descripcion?: string;
}

export interface PostPrestamoSolicitud {
  idParticipe?: number;
  fecha?: string;
  plazo?: number;
  idProducto?: number;
  tipoAmortizacion?: string;
  montoSolicitado?: number;
  valorCuota?: number;
  motivoPrestamo?: string;
}

export interface AdjuntoRolPago {
  tipoAdjunto?: string;
  adjunto?: string;
}

export interface AdjuntoCertificadoBan {
  observaciones?: string;
  adjunto?: string;
}

export interface PutSolicitud {
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  idNacionalidad?: number;
  fechaExpedicionCedula?: string;
  fechaIngresoCTE?: string;
  correo1?: string;
  correo2?: string;
  telefono1?: string;
  telefono2?: string;
  celular?: string;
  idGenero?: number;
  idEstadoCivil?: number;
  grado?: string;
  idNivelEstudios?: number;
  idNivelIngresos?: number;
  idActividadEconomica?: number;
  idProfesion?: number;
  profesion?: string;
  idGrado?: number;
  identificacionConyuge?: string;
  conyuge?: string;
  idTipoVivienda?: number;
  tiempoResidencia?: number;
  foto?: string;
  aporteAdicional?: number;
  fechaIngreso?: Date;
  codigoUniformado?: string;
  referenciasBancarias?: ReferenciaBancaria[];
  contacto?: Contacto[];
  direcciones?: Direccion[];
  referenciaBancaria?: ReferenciaBancaria[];
  referenciaPersonal?: ReferenciaPersonal[];
  perfilEconomico?: PerfilEconomico;
  titulo?: string;
}

export interface Contacto {
  nombre?: string;
  telefono?: string;
  correo?: string;
  celular?: string;
}

export interface Direccion {
  tipoDireccion?: any;
  idEntidad?: any;
  idPais?: any;
  idProvincia?: any;
  idCanton?: any;
  idParroquia?: any;
  callePrincipal?: any;
  calleSecundaria?: any;
  referencia?: any;
}

export interface PerfilEconomico {
  salarioFijo?: any;
  salarioVariable?: any;
  origenOtrosIngresos?: any;
  otrosIngresos?: any;
  gastosMensuales?: any;
  totalBienes?: any;
  totalVehiculos?: any;
  totalOtrosActivos?: any;
  totalDeudas?: any;
  patrimonioNeto?: any;
  totalActivos?: any;
  totalIngresos?: any;
  salarioNeto?: any;
}

export interface ReferenciaBancaria {
  nombreEntidadFinanciera?: string;
  nombreTipoCuenta?: string;
  idEntidadFinanciera?: number;
  numeroCuenta?: string;
  idTipoCuenta?: number;
  fechaActualizacion?: number;
  adjunto?: any;
}

export interface ReferenciaPersonal {
  nombres?: string;
  telefono?: string;
}

export interface Identificacion {
  idParticipe?: number;
  idTipoIdentificacion?: number;
  tipoIdentificacion?: string;
  identificacion?: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  fechaRegistro?: string;
  usuarioRegistro?: string;
  estado?: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  fechaFallecimiento?: string;
  causaFallecimiento?: string;
  idNacionalidad?: number;
  fechaExpedicionCedula?: string;
  correo1?: string;
  correo2?: string;
  telefono1?: string;
  telefono2?: string;
  celular?: string;
  titulo?: string;
  idGenero?: number;
  idEstadoCivil?: number;
  idNivelEstudios?: number;
  idNivelIngresos?: number;
  idProfesion?: number;
  idGrado?: number;
  identificacionConyuge?: string;
  conyuge?: string;
  idTipoVivienda?: number;
  tiempoResidencia?: number;
  photoUrl?: string;
  codigoUniformado?: string;
  fechaIngreso?: string;
  aporteAdicional?: number;
  actividadEconomica?: string;
  nacionalidad?: string;
  genero?: string;
  estadoCivil?: string;
  nivelEstudios?: string;
  nivelIngresos?: string;
  profesion?: string;
  grado?: string;
  tipoVivienda?: string;
  perfilEconomico?: {
    fechaRegistroTrabajo?: string;
    salarioFijo?: number;
    salarioVariable?: number;
    origenOtrosIngresos?: number;
    otrosIngresos?: number;
    totalIngresos?: number;
    gastosMensuales?: number;
    totalBienes?: number;
    totalVehiculos?: number;
    totalOtrosActivos?: number;
    totalActivos?: number;
    totalDeudas?: number;
    patrimonioNeto?: number;
    salarioNeto?: number;
    fechaActualizacion?: string;
  };
  contratos?: [
    {
      idContrato?: number;
      idEntidad?: number;
      fechaInicio?: string;
      porcentajeAporte?: number;
      idRelacionLaboral?: number;
      observaciones?: string;
      estado?: string;
      aporteIndividual?: number;
      aporteAdicional?: number;
      fechaTerminacion?: string;
      motivoTerminacion?: number;
      identificacion?: string;
      nombres?: string;
    }
  ];
  contactos?: [
    {
      nombre?: string;
      telefono?: string;
      correo?: string;
      celular?: string;
      idContacto?: number;
      idEntidad?: number;
    }
  ];
  direcciones?: [
    {
      idDireccion?: number;
      tipoDireccion?: string;
      idEntidad?: number;
      idPais?: number;
      pais?: string;
      idProvincia?: number;
      provincia?: string;
      idCanton?: number;
      canton?: string;
      idParroquia?: number;
      parroquia?: string;
      callePrincipal?: string;
      calleSecundaria?: string;
      referencia?: string;
    }
  ];
  referenciasPersonales?: [
    {
      nombres?: string;
      telefono?: string;
      idReferenciaPersonal?: number;
      idEntidad?: number;
    }
  ];
  referenciasBancarias?: [
    {
      idReferenciaBancaria?: number;
      idEntidadFinanciera?: number;
      numeroCuenta?: string;
      idTipoCuenta?: number;
    }
  ];
}

export interface institucionesFinancieras {
  idEntidadFinanciera?: number;
  descripcion?: string;
  codigoSbs?: string;
  idTipoFinanciera?: number;
  idEstado?: number;
}

export interface PrestamosEstados {
  idPrestamo: number;
  idParticipe: number;
  identificacion: string;
  nombre: string;
  idTipoPrestamo: number;
  plazo: number;
  idTipoPlazo: number;
  tipoPrestamo: string;
  tipoAmortizacion: string;
  fecha: string;
  fechaInicio: string;
  fechaFin: string;
  interesNominal: number;
  montoSolicitado: number;
  tasa: number;
  valorCuota: number;
  totalCapital: number;
  totalInteres: number;
  totalMora: number;
  totalPagado: number;
  saldoTotal: number;
  saldoVencido: number;
  saldoPorVencer: number;
  tasaEfectiva: number;
  saldoCapital?: number;
  saldoInteres?: number;
  estado: string;
  detalles: Detalle[];
  totalSaldoCancelacion?: number
}

export interface Prestamo {
  idProveedor?: number;
  idPrestamo?: number;
  idParticipe?: number;
  identificacion?: string;
  nombre?: string;
  correo?: string;
  codigoUniformado?: string;
  descuentoMora?: number;
  moraAnterior?: number;
  valorDiferido?: number;
  idTipoPrestamo?: number;
  plazo?: number;
  plazoMeses?: number;
  idTipoPlazo?: number;
  idProducto?: number;
  producto?: string;
  tipoPrestamo?: string;
  tipoAmortizacion?: string;
  fecha?: Date;
  fechaInicio?: string;
  fechaFin?: Date;
  interesNominal?: number;
  montoSolicitado?: number;
  tasa?: number;
  tasaEfectiva?: number;
  tasaNominal?: number;
  valorCuota?: number;
  totalCapital?: number;
  totalInteres?: number;
  totalMora?: number;
  totalPagado?: number;
  totalPrestamo?: number;
  totalSeguros?: number;
  saldoTotal?: number;
  saldoVencido?: number;
  saldoPorVencer?: number;
  idEstadoOperacion?: number;
  motivoPrestamo?: string;
  observaciones?: string;
  idPrestamoPadre?: number;
  montoAcreditado?: string;
  numeroCuenta?: string;
  tipoCuenta?: string;
  bancoAcreditado?: string;
  estado?: string;
  esNovacion?: boolean;
  reprocesado?: boolean;
  refinanciado?:boolean;
  restructurado?: boolean;
  electronica?: boolean;
  fechaRegistro?: Date;
  usuarioRegistro?: string;
  ipRegistro?: string;
  fechaModificacion?: Date;
  usuarioModificacion?: string;
  ipModificacion?: string;
  garantes?: Garante[];
  garantias?: Garantia[];
  detalles?: Detalle[];
  calificacion?: any;
  moraCalculada?: number;
  interesVariable?:number;
}

export interface Detalle {
  numCuota?: number;
  fechaVencimiento?: Date;
  capital?: number;
  interes?: number;
  desgravamen?: number;
  cuota?: number;
  total?: number;
  mora?: number;
  diasMora?: number;
  fechaPagado?: Date;
  abono?: number;
  capitalPagado?: number;
  interesPagado?: number;
  saldoCapital?: number;
  saldoInteres?: number;
  saldoMora?: number;
  estado?: string;
}

export interface Festivo {
  idFestivo: number;
  descripcion: string;
  fechaDesde: Date;
  fechaHasta: Date;
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface Response {
  result?: any[];
  error?: string;
  message?: string;
  statusCode?: number;
  success?: boolean;
}

export interface OperationResultPrestamo {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface OperationResultCatalogo {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface OperationResultParticipe {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface OperationResultTickets {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface OperationResultVector {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface Provincia {
  idProvincia?: number;
  descripcion?: string;
  idPais?: string;
  codigoSbs?: string;
  ciudad?: Ciudad[];
}

export interface Ciudad {
  idCiudad?: number;
  descripcion?: string;
  idProvincia?: number;
  codigoSbs?: string;
  canton?: string;
  descripcionLarga?: string;
  parroquias?: Parroquia[];
}

export interface Parroquia {
  idParroquia?: number;
  descripcion?: string;
  idCiudad?: number;
  codigoSbs?: string;
}

export interface SimulacionPrestamo {
  idParticipe?: number;
  fechaInicio?: string;
  plazo?: number;
  tipoAmortizacion?: string;
  montoSolicitado?: number;
  idProducto?: number;
}

export interface Pagos {
  fecha?: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
  desgraDesgravamentPagado?: number;
  detalle?: Detalle[];
  estado?: string;
  fechaPrestamo?: number;
  totalMoraPagada?: number;
  idEntidad?: number;
  identificacion?: string;
  idPrestamo?: number;
  idTipoPlazo?: number;
  interesNominal?: number;
  montoSolicitado?: number;
  otros?: number;
  plazo?: number;
  razonSocial?: string;
  saldoCapital?: number;
  saldoCapitalPagado?: number;
  saldoDesgraDesgravament?: number;
  saldoInteres?: number;
  saldoInteresPagado?: number;
  saldoVencimiento?: number;
  tasaEfectiva?: number;
  tasaNominal?: number;
  tipoAmortizacion?: string;
  tipoPrestamo?: string;
  totalCapital?: number;
  totalPrestamo?: number;
  totalDesgravamen?: number;
  totalInteres?: number;
  totalOtros?: number;
  valorCuota?: number;
  totalPagado?: number;
  totalInteresVencido?:number;
}

export interface Detalle {
  idPagoPrestamo?: number;
  idRecibo?: number;
  idPrestamo?: number;
  idDetallePrestamo?: number;
  fecha?: Date;
  fechaVencimiento?: Date;
  valor?: number;
  numCuota?: number;
  capitalPagado?: number;
  interesPagado?: number;
  morapagada?: number;
  desgravamen?: number;
  tipo?: string;
  saldoOtros?: number;
}

export interface OperationResult {
  error?: string;
  message?: string;
  statusCode?: string;
  success?: boolean;
  result?: any;
}

export interface SimulacionResult {
  fechaInicio: Date;
  plazo: number;
  tipoAmortizacion: string;
  montoSolicitado: number;
  idProducto: number;
  tasa: number;
  tasaEfectiva: number;
  fechaVencimiento: Date;
  valorCuota: number;
  totalInteres: number;
  totalCapital: number;
  totalDesgravamen: number;
  totalPrestamo: number;
  totalMora: number;
  cuotas: Cuota[];
  validaciones: Validacione[];
}

export interface Cuota {
  numCuota: number;
  fechaVencimiento: Date;
  interes: number;
  capital: number;
  desgravamen: number;
  mora: number;
  cuota: number;
  total: number;
  saldo: number;
}

export interface Validacione {
  valido: boolean;
  descripcion: string;
  observaciones: string;
}

export interface Calificadora {
  idEntidad?: number;
  identificacion?: string;
  razonSocial?: string;
  idTipoPersona?: number;
  idPais?: string;
  idProvincia?: number;
  idCanton?: number;
  idParroquia?: number;
  direccion?: string;
  referencia?: string;
  correo1?: string;
  celular?: string;
  web?: string;
  telefono1?: string;
  idTipoIdentificacion?: number;
}

export interface Tenedor {
  idMantenimiento?: number;
  ruc?: string;
  razonSocial?: string;
  idProvincia?: number;
  idCiudad?: number;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  celular?: any;
  correo?: string;
  web?: string;
}

export interface Emisor {
  idEntidad?: number;
  idTipoIdentificacion: string;
  identificacion: string;
  razonSocial: string;
  ruc?: string;
  nombre?: string;
  nombreComercial: string;
  idPais: number;
  idProvincia: number;
  idCiudad: number;
  idCanton: number;
  idParroquia: number;
  idCalificacionFinanciera: number;
  direccion: any;
  referencia: string;
  celular: string;
  telefono1: string;
  telefono2: string;
  correo: string;
  correo1: string;
  correo2: string;
  fechaConstitucion: string;
  idEstado: number;
  calificacion: string;
  numeroResolucion: string;
  numeroInscripcion: string;
  web: string;
  sectorPublico: true;
  sistemaFinanciero: true;
  idTipoPersona: number;
}

export interface Casa {
  idCasaValor?: number;
  nombreComercial?: string;
  razonSocial?: string;
  ruc?: string;
}

export interface Calificadora {
  idEntidad?: number;
  idTipoPersona?: number;
  identificacion?: string;
  nombreComercial?: string;
  razonSocial?: string;
}

export interface SimulacionInversion {
  fechaInicio: string;
  fechaVencimiento: string;
  valorNominal: number;
  tasa: number;
  tipoPlazo: string;
  dias: number;
  gracia: number;
  tipoCapital: string;
}

export interface Inversion {
  idInversion?: number;
  numeroCertificado?: string;
  idTipoInversion?: number;
  idEmisor?: number;
  idEmisorValor?: number;
  idCasaValor?: number;
  idCalificadoraRiesgo?: number;
  calificacionEmisor?: number;
  fechaCalificacionEmisor?: string;
  codigoVector?: string;
  valorLibros?: number;
  valorNominal?: number;
  valorCompras?: number;
  tasaDeInteres?: number;
  impuesto?: number;
  costoCasaValores?: number;
  costoBolsaValores?: number;
  fechaCompra?: string;
  fechaEmision?: string;
  fechaVencimiento?: string;
  fechaVencimientoInteres?: string;
  tipoperiodoPagoInteres?: string;
  custodioTitulo?: string;
  periodoInteresDias?: number;
  periodoPagoCapital?: number;
  tipoperiodoPagoCapital?: string;
  tipoRenta?: string;
  tipoInversion?: string;
  codigo?: string;
  emisor?: string;
  valorEnLibro?: number;
  valorCompra?: number;
  tasa?: number;
  numeroAcciones?: number;
  precioPorAccion?: number;
  desdeAccion?: number;
  hastaAccion?: number;
  valorMercado?: number;
  dividendo?: any[];
  totalCapital?: number;
  totalCobrar?: number;
  totalInteres?: number;
  diasPlazo?: number;
  idBolsaValores?: number;
}

export interface Tareas {
  idTarea: number;
  idTipoTarea: number;
  titulo: string;
  descripcion: string;
  idCanalTarea: number;
  fecha: Date;
  asignadoA: null;
  idParticipe: number;
  fechaEstimada: null;
  fechaCierre: null;
  estado: string;
  idTicket: number;
}

export interface TiempoAtendido {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface TicketInterno {
  idTicket: number;
  codigo: string;
  asunto: string;
  descripcion: string;
  fecha: Date;
  identificacion: string;
  nombre: string;
  estado: string;
  estadoHijo: string;
  estadoColor: string;
  esCesantia: boolean;
  idEntidad: number;
  idTipoTarea: number;
  idTipoTareaPadre: number;
  idDepartamento: number;
  idArea: number;
  idEstado: boolean;
  fechaFinalizado: Date;
  idTarea: number;
  tiempoAtendido: TiempoAtendido;
  idAgente?: any;
  codigoModulo?: any;
  nombreAgente?: any;
  modulo?: any;
  prioridad: string;
  tags: any[];
  leido: boolean;
  idTicketPadre: number;
  idEmpleado: number;
  tipoTarea: string;
  fechaTentativa: Date;
  requiereAprobacion: boolean;
  aprobador: string;
  fechaAprobacion: Date;
  fechaRechazo: Date;
  usuarioAprobo: string;
  usuarioRechazo: string;
}
export interface Ticket {
  codigo: string;
  codigoModulo: string;
  estado: string;
  fecha: string;
  fechaFinalizado: string;
  idAgente: number;
  idDepartamento: number;
  idEntidad: null;
  idEstado: true;
  idTarea: number;
  idTicket: number;
  idTipoTarea: number;
  identificacion: string;
  modulo: null;
  nombre: string;
  nombreAgente: null;
  tiempoAtendido: string;
}
export interface TicketTarea {
  asignadoA?: string;
  descripcion?: string;
  estado?: string;
  fecha?: string;
  fechaCierre?: null;
  fechaEstimada?: null;
  idCanalTarea?: number;
  idParticipe?: number;
  idTarea?: number;
  idTicket?: number;
  idTipoTarea?: number;
  titulo?: string;
}
export interface Empleado {
  idArea?: number;
  idDepartamento?: number;
  idEmpleado?: number;
  nombre?: string;
}
export interface Vector {
  nombreEmisor?: string;
  codigo?: string;
  fecha?: Date;
  idCalificadora?: number;
  idCalificacionFinanciera?: number;
  calificacion?: number;
  emisorTitulo?: string;
  fechaEmision?: Date;
  fechaVencimiento?: Date;
  formaDeCalculo?: string;
  margen?: number;
  numLinea?: number;
  plazoPorVencer?: number;
  precio?: number;
  tasaEfectiva?: number;
  tasaInteresCuponVigente?: number;
  tasaReferencia?: number;
  tipoBolsa?: number;
  titulo?: string;
  valorNominal?: number;
}

export interface VectorCoordenadas {
  x: Date;
  y: number;
}

export interface CalificacionEmisor {
  idCalificacionFinanciera?: number;
  fechaCalificacion?: string;
  idCalificadora?: number;
  idEmisor?: number;
}
export interface Abono {
  idEntidad?: number;
  identificacion?: string;
  nombre?: string;
  valor?: number;
  concepto?: string;
  tipo?: string;
  observaciones?: string;
  error?: boolean;
  fecha?: Date;
  saldo?: number;
  detalles?: Detalle[];
}

export interface Detalle {
  idPrestamo?: number;
  idDetallePrestamo?: number;
  fechaVencimiento?: Date;
  cuota?: number;
  capital?: number;
  interes?: number;
  desgravamen?: number;
  mora?: number;
  total?: number;
  saldo?: number;
}

export interface MiembrosCesantia {
  idEmpleado?: number;
  nombre?: string;
  idDepartamento?: number;
  idEntidad?: number;
}

export interface ReporteDTO {
  idReporte: number;
  tituto: string;
  descripcion: string;
}

export interface ReporteDTOLight {
  name: string;
  idReporte: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  procedimiento: string;
  periodicidad: string;
  tipo: 0;
  detalles: [];
  parametros: ParametrosReporte[];
}
export interface ParametrosReporte {
  descripcion: string;
  nombre: string;
  orden: number;
  requerido: boolean;
  tipo: any;
}

export interface OperationResultReporte {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result?: any[];
  error?: null;
  message?: string;
  statusCode?: string;
  success?: boolean;
}

export interface Departamento {
  idDepartamento: number;
  descripcion: string;
}

export interface ApiResponse {
  result: Result;
  error: null;
  message: string;
  statusCode: string;
  success: boolean;
}

export interface ApiResponseGeneric<T> {
  result: T;
  error: null;
  message: string;
  statusCode: string;
  success: boolean;
}

export interface Garantes {
  idGarante?: number;
  idPersona?: number;
  idPrestamo?: number;
  identificacion?: string;
  nombre?: string;
  montoGarantia?: number;
  observaciones?: string;
  saldoGarante?: number;
}

export interface Result {
  idInversion: number;
  codigo: string;
  numeroCertificado: string;
  idCalificadoraRiesgo: number;
  idEmisor: number;
  tipoInversion: string;
  idTenedor: null;
  idCustodioTitulo: null;
  fechaEmision: string;
  idTipoInversion: number;
  fechaVencimiento: string;
  fechaCompra: string;
  estado: number;
  idEmpresa: number;
  periodoPagoInteres: string;
  periodoPagoCapital: string;
  valorEnLibro: number;
  valorNominal: number;
  valorCompra: number;
  valorMercado: number;
  impuestos: number;
  costoCasaValores: number;
  costoBolsaValores: number;
  calificacionEmisor: string;
  tipoRenta: string;
  tasa: number;
  idCalificacionFinanciera: null;
  emisor: string;
  ruc: string;
  numeroAcciones: number;
  precioPorAccion: number;
  periodoGracia: boolean;
  desdeAccion: number;
  hastaAccion: number;
  detalleInversion: any[];
}

export interface VectorInversion {
  idVector: number;
  idInversion: number;
  fechaCorte: Date;
  codigo: string;
  idCalificacionFinanciera?: number;
  tasaInteresCupon: number;
  tasaReferencia?: number;
  margen?: number;
  tasaEfectiva?: number;
  tasaNominal: number;
  precio?: number;
  tipoBolsa?: number;
  idEmpresa: number;
  fechaRegistro: Date;
  usuarioRegistro: number;
  ipRegistro: string;
  fechaModificacion: number;
  usuarioModificacion: number;
  ipModificacion: null;
  rueda: number;
  presencia: number;
  formaCalculo: null;
  idInversionNavigation: null;
}

export interface BolsaValores {
  identifiacion: string;
  nombres: string;
  razonSocial: string;
  entidadFinanciera: EntidadFinanciera[];
}

export interface EntidadFinanciera {
  descripcion: string;
  idTipoFinanciera: number;
  idEntidad?: number;
}


export class CuentasContables {
  value: string
  codigo?:string;
  collapsed?:boolean=null;
  text?: string;
  idVista: number;
  children?:CuentasContables[]=null;
  constructor(element:any) {
    this.value = element.idCuentaContable;
    this.text = element.descripcion;
    this.codigo=element.codigo;
    this.idVista=element.idVista;
    if(element.subCuentas.length>0){
      this.children= element.subCuentas.map(cuentas => new CuentasContables(cuentas))
      this.collapsed=true;
    }
   
  }
}

export class CuentaContable {
  idCuentaContable: number;
  codigo:string;
  idTipoCuentaContable: number;
  idCuentaSuperior: number;
  naturaleza: string;
  nivel: number;
  idRegimenTributario:number;
  codigoSbs: string;
  codigoFlujo: string;
  codigoPresupuesto: string;
  constructor(element:any) {
    this.codigo=element.codigo;
    this.idCuentaContable=element.idCuentaContable;
    this.idTipoCuentaContable=element.idTipoCuentaContable;
    this.idCuentaSuperior=element.idCuentaSuperior;
    this.naturaleza=element.naturaleza;
    this.nivel=element.nivel;
    this.idRegimenTributario=element.idRegimenTributario;
    this.codigoSbs=element.codigoSbs;
    this.codigoFlujo=element.codigoFlujo;
    this.codigoPresupuesto=element.codigoPresupuesto;
  }
}
export class CuentaContablePTree {
  data: any
  label?: string;
  expandedIcon?:string;
  collapsedIcon?:string;
  children?:CuentaContablePTree[]=null;
  countChildren: number=0;
  idCuentaContable: number;
  codigo?:string;
  constructor(element:any) {
    this.data = element.idCuentaContable;
    this.label = element.descripcion;
    this.idCuentaContable=element.idCuentaContable
    this.codigo=element.codigo;
    if(element.subCuentas.length>0){
      this.expandedIcon="pi pi-folder-open";
      this.collapsedIcon="pi pi-folder";
      this.children= element.subCuentas.map(cuentas => new CuentaContablePTree(cuentas))
      this.countChildren=element.subCuentas.length;   
    }
  }
}
