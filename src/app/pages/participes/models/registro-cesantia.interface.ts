export interface RegistroCesantia {
    idTipoCesantia?: number;
    idEntidad?: number;
    idSolicitante?: number;
    fechaSalida?: Date;
    fechaFallecimiento?: Date;
    motivoSalida?: string;
    esFallecido?: boolean;
    aplicaDesgravamen?: boolean;
}

export interface Beneficiario {
    idEntidad?: number;
    idParentesco?: number;
    valor?: number;
    observaciones?: string;
    numeroReferencia?: string;
    idCuentaBancaria?: number;
    idMetodoPago?: number;
}

export interface DetalleLiquidacion {
    totalIngresos?: number;
    totalEgresos?: number;
    saldoPagar?: number;
    saldoCobrar?: number;
    detalles?: Detalle[];
}

export interface Detalle {
    idRubroCesantia?: number;
    rubroCesantia?: string;
    tipo?: string;
    total?: number
    valores?: Valore[];
}

export interface Valore {
    detalle?: string;
    referencia?: string;
    valor?: number;
    idTipoAporte?: number;
    idPrestamo?: number;
}
