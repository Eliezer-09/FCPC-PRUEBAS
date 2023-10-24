export interface Miembros {
    idEmpleado?:     number;
    nombre?:         string;
    idDepartamento?: number;
    idEntidad?:      number;
}

export interface TipoTarea {
    idTipoTarea?:    number;
    codigo?:         string;
    descripcion?:    string;
    idDepartamento?: number;
    idEstado?:       boolean;
}


export interface TicketsInternos {
    idTicket?:        number;
    idTicketPadre?:   number;
    codigo?:          string;
    fecha?:           Date;
    identificacion?:  string;
    nombre?:          string;
    estado?:          string;
    idEntidad?:       number;
    idTipoTarea?:     number;
    idDepartamento?:  number;
    idEstado?:        boolean;
    fechaFinalizado?: Date;
    idTarea?:         null;
    tiempoAtendido?:  { [key: string]: number };
    idAgente?:        null;
    idEmpleado?:      null;
    codigoModulo?:    null;
    nombreAgente?:    null;
    modulo?:          null;
    prioridad?:       string;
    tags?:            null;
    asunto?:          null;
    descripcion?:     null;
    leido?:           boolean;
}

export interface Estados {
    idEstadoTicket: number,
    descripcion: string
}

export interface Areas {
    idArea?: number;
    idDepartamento?: number;
    descripcion?: string;
}