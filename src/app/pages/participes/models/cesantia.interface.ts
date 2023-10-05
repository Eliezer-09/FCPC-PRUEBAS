export interface SimulacionCesantia {
    totalIngresos?: number;
    totalEgresos?:  number;
    saldoPagar?:    number;
    saldoCobrar?:   number;
    detalles?:      Detalle[];
}

export interface Detalle {
    idRubroCesantia?: number;
    rubroCesantia?:   string;
    tipo?:            string;
    total?:           number;
    valores?:         Valore[];
}

export interface Valore {
    detalle?:      string;
    referencia?:   string;
    valor?:        number;
    idTipoAporte?: number;
    idPrestamo?:   number;
}

export interface Cesantia {
    idCesantia?:         number;
    idTipoCesantia?:     number;
    tipoCesantia?:       string;
    idEntidad?:          number;
    identificacion?:     string;
    nombre?:             string;
    fechaSalida?:        Date;
    fechaFallecimiento?: Date;
    motivoSalida?:       string;
    estado?:             string;
    totalIngresos?:      number;
    totalEgresos?:       number;
    saldoPagar?:         number;
    saldoCobrar?:        number;
    detalles?:           any;
    adjuntos?:           any;
}

