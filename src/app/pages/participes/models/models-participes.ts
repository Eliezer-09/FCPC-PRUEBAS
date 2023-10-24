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
    titulo?: string;
    tipoVivienda?: string;
    calificacionCredito?: string;
    perfilEconomico?: { [key: string]: number };
    garantes?: Garante[];
    contratos?: Contrato[];
    contactos?: Contacto[];
    direcciones?: Direccione[];
    referenciasPersonales?: ReferenciasPersonales[];
    referenciasBancarias?: ReferenciasBancaria[];
}

export interface Garante {
    idGarante?: number;
    idPersona?: number;
    identificacion?: string;
    nombre?: string;
    montoGarantia?: number;
    observaciones?: string;
    causaEliminacion?: string;
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

export interface Contacto {
    nombre?: string;
    telefono?: string;
    correo?: string;
    celular?: string;
    idContacto?: number;
    idEntidad?: number;
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
 
 export interface ReferenciasPersonales {
    nombres?: string;
    telefono?: string;
    idReferenciaPersonal?: number;
    idEntidad?: number;
}