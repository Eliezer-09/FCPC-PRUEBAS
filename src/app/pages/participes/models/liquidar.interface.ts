export interface RegistroLiquidar {
    totalIngresos?: number;
    totalEgresos?:  number;
    saldoPagar?:    number;
    saldoCobrar?:   number;
    fechaLiquidacion?: Date;
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
