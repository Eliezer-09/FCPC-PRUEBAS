export interface DetalleCesante {
    idCesantia?: number
    idTicket?: number
    idTipoCesantia?: number
    idDetalleCesantia?: number
    idEntidad?: number
    idParentesco?: number
    fechaSalida?: Date
    motivoSalida?: string;
    cedula?: string
    nombre?: string
}
export interface RegistrarCesante {
    idEntidad?:          number;
    fecha?:              Date;
    fechaSalida?:        Date;
    fechaFallecimiento?: Date;
    esFallecido?:        boolean;
    motivoSalida?:       string;
    aplicaDesgravamen?:  boolean;
    motivoTerminacion?:  string;
    comentarios?:        string;
}
export interface ActualizarCesante {
    idCesante?:          number;
    idTipoCesantia?:     number;
    fechaFallecimiento?: Date;
    motivoSalida?:       string;
}


export interface RegistrarBeneficiario {
    identificacion?:        string;
    nombres?:               string;
    apellidos?:             string;
    correo1?:               string;
    fechaNacimiento?:       Date;
    fechaExpedicionCedula?: Date;
    telefono1?:             string;
    celular?:               string;
    esParticipe?:           boolean;
    idNacionalidad?:        number;
    observaciones?:         string;
    numeroReferencia?:      string;
    idCuentaBancaria?:      number;
    idMetodoPago?:          number;
    pagado?:                boolean;
    idParentesco?:          number;
}


export interface Cesante {
    idTipoIdentificacion?:  number;
    tipoIdentificacion?:    string;
    identificacion?:        string;
    nombres?:               string;
    apellidos?:             string;
    razonSocial?:           string;
    fechaNacimiento?:       Date;
    lugarNacimiento?:       string;
    idNacionalidad?:        number;
    idCesantia?: number;
    fechaExpedicionCedula?: Date;
    correo1?:               string;
    correo2?:               string;
    telefono1?:             string;
    telefono2?:             string;
    celular?:               string;
    fechaNacPersona?:       string;
    idGenero?:              number;
    idEstadoCivil?:         number;
    idProfesion?:           number;
    idGrado?:               number;
    foto?:                  string;
    codigoUniformado?:      string;
    fechaIngreso?:          Date;
    fechaInicio?:           Date;
    aporteAdicional?:       number;
    observaciones?:         string;
    fechaFallecimiento?:    Date;
    causaFallecimiento?:    string;
    esFallecido?:           boolean;
    motivoTerminacion?:     string;
    fechaSalida?:           Date;
    motivoSalida?:          string;
    estado?:                string;
    fechaRegistro?:         Date;
    fechaModificacion?:     Date;
    usuarioRegistro?:       string;
    usuarioModificacion?:   string;
}

export interface Detalle {
    idParentesco?:      number;
    idDetalleCesantia?: number;
    cedula?:            string;
    nombre?:            string;
}
export interface RegistroBeneficiario {
    identificacion?:        string;
    nombres?:               string;
    apellidos?:             string;
    correo1?:               string;
    fechaNacimiento?:       Date;
    fechaExpedicionCedula?: Date;
    telefono1?:             string;
    celular?:               string;
    idNacionalidad?:        number;
    observaciones?:         string;
    numeroReferencia?:      string;
    idCuentaBancaria?:      number;
    idMetodoPago?:          number;
    pagado?:                boolean;
    idParentesco?:          number;
    valor?:                 number;
}
export interface CesantiaBeneficiario {
    idParticipe?:           number;
    idTipoIdentificacion?:  number;
    tipoIdentificacion?:    string;
    identificacion?:        string;
    nombres?:               string;
    apellidos?:             string;
    razonSocial?:           string;
    fechaRegistro?:         Date;
    fechaModificacion?:     Date;
    usuarioRegistro?:       string;
    usuarioModificacion?:   string;
    estado?:                string;
    fechaNacimiento?:       Date;
    lugarNacimiento?:       string;
    idNacionalidad?:        number;
    fechaExpedicionCedula?: Date;
    correo1?:               string;
    correo2?:               string;
    telefono1?:             string;
    telefono2?:             string;
    celular?:               string;
    fechaNacPersona?:       string;
    idGenero?:              number;
    idEstadoCivil?:         number;
    idProfesion?:           number;
    idGrado?:               number;
    foto?:                  string;
    codigoUniformado?:      string;
    fechaIngreso?:          Date;
    fechaInicio?:           Date;
    aporteAdicional?:       number;
    observaciones?:         string;
    calificacionCredito?:   string;
    token?:                 string;
    idTipoUniformado?:      number;
    idParentesco?:          number;
    valor?:                 number;
    pagado?:                boolean;
    aplicable?:             boolean;
}

export interface Beneficiario {
    idParticipe?:           number;
    idTipoIdentificacion?:  number;
    tipoIdentificacion?:    string;
    identificacion?:        string;
    nombres?:               string;
    apellidos?:             string;
    razonSocial?:           string;
    fechaRegistro?:         Date;
    fechaModificacion?:     Date;
    usuarioRegistro?:       string;
    usuarioModificacion?:   string;
    estado?:                string;
    fechaNacimiento?:       Date;
    lugarNacimiento?:       string;
    idNacionalidad?:        number;
    fechaExpedicionCedula?: Date;
    correo1?:               string;
    correo2?:               string;
    telefono1?:             string;
    telefono2?:             string;
    celular?:               string;
    fechaNacPersona?:       string;
    idGenero?:              number;
    idEstadoCivil?:         number;
    idProfesion?:           number;
    idGrado?:               number;
    foto?:                  string;
    codigoUniformado?:      string;
    fechaIngreso?:          Date;
    fechaInicio?:           Date;
    aporteAdicional?:       number;
    observaciones?:         string;
    calificacionCredito?:   string;
    token?:                 string;
    idTipoUniformado?:      number;
    idParentesco?:          number;
    idEntidad?:             number;
    valor?:                 number;
    pagado?:                boolean;
}
