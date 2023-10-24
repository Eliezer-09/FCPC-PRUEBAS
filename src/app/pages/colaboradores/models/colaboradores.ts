export interface ApiResponse {
  pageNumber?: number;
  pageSize?: number;
  length?: number;
  totalPages?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  result: any;
  error: null;
  message: string;
  statusCode: string;
  success: boolean;
  errors: any;
}
export interface DatosPersonales {
  id: number;
  nombres: string;
  apellidos: string;
  nombrePila: string;
  fechaNacimiento: Date;
  fechaIngreso: Date;
  idTipoIdentificacion: number;
  identificacion: string;
  lugarNacimiento: string;
  idNacionalidad: number;
  idGenero: number;
  idEstadoCivil: number;
  tieneHijos: boolean;
  esDiscapacitado: boolean;
  correo1: string;
  celular: string;
  telefono2: string;
  telefono1: string;
  operadoraMovil: string;
}

export interface AdjuntosColaborador {
  idTipoColaborador: number;
  idTipoAdjunto: number;
  esRequerido: boolean;
  idEstado: boolean;
  nombreSeccion: NombreSeccion;
  nombreAdjunto: string;
  idTipoDocumento: number;
  multiple: boolean;
  idColaborador: number;
  orden: number;
  archivos: Archivo[];
}

export interface Archivo {
  idReferenciaBancaria: number;
  idReferenciaPersonal: number;
  idFormacionAcademica: number;
  idVehiculo: number;
  path: string;
  url: null | string;
  idAdjunto: number;
}

export enum NombreSeccion {
  DocumentosLegales = "DOCUMENTOS LEGALES",
  DocumentosPersonales = " DOCUMENTOS PERSONALES",
  FormacionAcadémicaCapacitaciones = "FORMACION ACADÉMICA / CAPACITACIONES",
  MemorandumsEvaluaciones = "MEMORANDUMS / EVALUACIONES",
  VacacionesPermisos = "VACACIONES / PERMISOS",
  documentoIngreso = "DOCUMENTOS DE INGRESO",
}

export interface ColaboradorPersona {
  persona: Persona;
  proveedor: Proveedor;
  colaborador: Colaborador;
  datosDiscapacidad: null;
  idEntidad: number;
  idTipoIdentificacion: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  razonSocial: string;
  idActividadEconomica: null;
  fechaNacimiento: Date;
  lugarNacimiento: string;
  idNacionalidad: number;
  fechaExpedicionCedula: null;
  correo1: string;
  correo2: null;
  telefono1: string;
  telefono2: string;
  celular: string;
  esProveedor: boolean;
  esParticipe: boolean;
  esEmpleadoActivo: boolean;
  foto: string;
  idEmpresa: number;
  edadActual: number;
  estado: null;
  idRepresentanteLegal: null;
  idTipoPersona: number;
  nombreComercial: null;
  web: null;
  esPasivo: boolean;
  esCesante: boolean;
  operadoraMovil: string;
}

export interface Proveedor {
  idProveedor: number;
  idClaseContribuyente: number;
  esPersonaJuridica: boolean;
  idRepresentanteLegal: number;
  idContador: number;
  obligadoContabilidad: boolean;
  esRegimenMicroempresa: boolean;
  esAgenteRetencion: boolean;
  esContribuyenteEspecial: boolean;
  noResolucion: string;
  valorFacturacion: number;
  servicioProducto: boolean;
  esRecurente: boolean;
}

export interface InformacionLaboral {
  id: number;
  codigoBiometrico: string;
  idTipoColaborador: number;
  idArea: number;
  idCargo: number;
  idDepartamento: number;
  fechaInicio: Date;
  telefono: string;
  extension: string;
  correo: string;
  idSupervisor: number;
  idJefeInmediato: number;
  idTipoContrato: number;
  idTipojornada: number;
  idModalidad: number;
  idReferenciaBancaria: number;
  fechaPeriodoPrueba: Date;
  idFormaReclutamiento: number;
  fechaReclutamiento: Date;
  fechaSeleccion: Date;
  referenciaLaboral: boolean;
  conocePersonalCte: boolean;
  revisionBuroCredito: boolean;
  antecedentesPenales: boolean;
  funcionJudicial: boolean;
  fechaVencimiento: Date;
  codigoSectorialIess: string;
  montoIva: number;
  montoBase: number;
  porcentajeRetencion: number;
  idRol: number;
  esGerente: boolean;
  esSupervisorInmediato: boolean;
  esJefeInmediato: boolean;
  anticipo: boolean;
  porcentajeAnticipo: number;

  valorAnticipo: number;
  esSustituto: boolean;
}

export interface Persona {
  idPersona: number;
  idGenero: number;
  idEstadoCivil: number;
  idNivelEstudios: number;
  idNivelIngresos: number;
  idProfesion: number;
  idGrado: number;
  sueldoActual: number;
  fechaIngreso: Date;
  idRelacionLaboral: number;
  identificacionConyuge: string;
  conyuge: string;
  idTipoVivienda: number;
  tiempoResidencia: number;
  idEmpresa: number;
  tiempoServicio: number;
  codigoUniformado: string;
  calificacionCredito: string;
  idTipoUniformado: number;
  fechaFallecimiento: Date;
  discapacidadSustituto: number;
  causaFallecimiento: string;
  fechaSalida: Date;
  motivoSalida: string;
  idTipoPersona: number;
  titulo: string;
  idParentescoSustituto: number;
  esDiscapacitado: boolean;
  tieneHijos: boolean;
  cargasFamiliares: number;
  nombrePila: string;
  numeroCarnetConadis: string;
  porcentajeDiscapacidad: number;
  idTipoDiscapacidad: number;
  fechaEmisionConadis: Date;
}

export interface Colaborador {
  id: number;
  codigoBiometrico: string;
  idTipoColaborador: number;
  idArea: number;
  idCargo: number;
  idColaborador?: number;
  idDepartamento: number;
  fechaInicio: Date;
  telefono: string;
  extension: string;
  correoEmpresa: string;
  idSupervisor: number;
  idJefeInmediato: number;
  idTipojornada: number;
  idModalidad: number;
  idReferenciaBancaria: number;
  fechaPeriodoPrueba: Date;
  idFormaReclutamiento: number;
  fechaReclutamiento: Date;
  fechaSeleccion: Date;
  referenciaLaboral: boolean;
  conocePersonalCte: boolean;
  revisionBuroCredito: boolean;
  antecedentesPenales: boolean;
  funcionJudicial: boolean;
  fechaVencimiento: Date;
  codigoSectorialIess: string;
  montoIva: number;
  montoBase: number;
  porcentajeRetencion: number;
  idRol: number;
  esGerente: boolean;
  esSupervisorInmediato: boolean;
  esJefeInmediato: boolean;
  anticipo: boolean;
  porcentajeAnticipo: number;

  valorAnticipo: number;
  esSustituto: boolean;
  observaciones: string;
}

export interface TipoColaborador {
  idTipoColaborador: number;
  descripcion: string;
  codigoSbs: string;
  idEstado: boolean;
}

export interface Genero {
  idGenero: number;
  descripcion: string;
  codigoSbs: string;
}

export interface Area {
  idArea: number;
  descripcion: string;
  idDepartamento: number;
}

export interface TipoIdentificacion {
  idTipoIdentificacion: number;
  descripcion: string;
  codigoSbs: string;
  tipo: number;
}
export interface Direccion {
  idDireccion?: number;
  idEntidad?: number;
  idTipoDireccion: number;
  idPais: number;
  idProvincia: number;
  idCanton: number;
  nombrePais: string;
  nombreTipoDireccion: string;
  nombreCanton: string;
  sector: string;
  nombreParroquia: string;
  idParroquia: number;
  callePrincipal: string;
  calleSecundaria: string;
  referencia: string;
  visualizationMode: any;
}

export interface Contacto {
  idContacto: number;
  idEntidad: number;
  nombre: string;
  telefono: string;
  correo: string;
  nombreParentezco: string;
  celular: string;
  emergencia: boolean;
  idParentesco: number;
  visualizationMode: any;
}

export interface Transporte {
  tipoColaborador: any;
  idEntidad: any;
  idColaborador: any;
  idVehiculo: number;
  idTipoVehiculo: number;
  placa: string;
  marca: string;
  visualizationMode: any;
  modelo: string;
  clase: string;
  color: string;
  anio: string;
  propietario: string;
}

export interface CargaFamiliar {
  idDependiente: number;
  aplicaCarga: any;
  discapacidad: any;
  idParentezco: number;
  nombreParentezco: string;
  cedula: string;
  visualizationMode: any;
  fechaNacimiento: string;
  nombresCompletos: string;
  idColaborador: number;
}

export interface FormacionAcademica {
  dataSelect: any;
  nombreCertificacion: any;
  visualizationMode: any;
  tiempoCurso: any;
  idCertificacion: any;
  isCurso: any;
  tipo: any;
  tipoColaborador?: any;
  idFormacionAcademica: number;
  idNivelEstudios: number;
  institucionEducativa: string;
  titulo: string;

  cursandoActualmente: any;
  fechaInicio: string;
  fechaCulminacion: string;
  anioCursando: string;
  idColaborador: number;
  idEntidad: any;
  idAdjunto: number;
  nombreNivelEstudios: string;
}

export interface ReferenciaPersonal {
  visualizationMode: any;
  tipoColaborador: any;
  idColaborador: any;
  idAdjunto: any;
  idReferenciaPersonal: number;
  nombres: string;
  telefono: string;
  correo: string;
  observaciones?: string;
  idEntidad?: number;
  idEntidadPersona:number;
}

export interface ReferenciaBancaria {
  idColaborador: any;
  visualizationMode: any;
  tipoColaborador: any;
  idReferenciaBancaria: number;
  idEntidadFinanciera: number;
  numeroCuenta: string;
  idTipoCuenta: number;
  idEntidad?: number;
  adjunto?: string;
  nombreEntidadFinanciera: string;
  nombreTipoCuenta: string;
  idEntidadPersona:number;
}

export interface Nacionalidades {
  idPais: string;
  codigoIso: string;
  nacionalidad: string;
}
export interface EstadoCivil {
  idEstadoCivil: number;
  descripcion: string;
  codigoSbs: string;
}

export interface TipoVehiculo {
  idTipoVehiculo: number;
  descripcion: string;
  codigoSbs: string;
  idEstado: boolean;
}

export interface TipoDireccion {
  idTipoDireccion: number;
  codigoSbs: string;
  descripcion: string;
}
