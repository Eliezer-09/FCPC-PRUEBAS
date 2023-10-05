export interface Paises {
    idPais?: number,
    nacionalidad?: string,
    codigoSbs?: string
}

export interface CuentaBancaria {
    idEntidadFinanciera?: number;
    descripcion?:         string;
    codigoSbs?:           string;
    idTipoFinanciera?:    number;
    idEstado?:            number;
}

export interface Aportes {
    tipoAporte?:   string;
    idTipoAporte?: number;
    valor?:        number;
    saldo?:        number;
    descuentos?:   number;
    total?:        number;
}

export interface MetodoPago {
    idMetodoPago?: number;
    codigoSBS?:    string;
    descripcion?:  string;
}

export interface Adjunto {
    idTipoAdjunto?:        number;
    idParticipe?:          number;
    idReferenciaBancaria?: number;
    nombre?:               string;
    identificacion?:       string;
    path?:                 string;
    observaciones?:        string;
    mimeType?:             string;
    tipoAdjunto?:          string;
}
export interface Parentesco {
    idParentesco?: number;
    codigo?:      string;
    descripcion?: string;
}
