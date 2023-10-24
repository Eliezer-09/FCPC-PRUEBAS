import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const DescuentosConfigure: TableColumn<any>[] = [
  {
    label: "NO.",
    property: "no",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "TIPO",
    property: "tipo",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "VALOR",
    property: "valor",
    type: "text",
    cssClasses: ["font-medium", "decimal"],
  },

  {
    label: "FECHA DE REGISTRO",
    property: "fechaRegistro",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  
  {
    label: "acciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-20"],
  }
];

export const vacacionesConfigure: TableColumn<any>[] = [
  {
    label: "NO.",
    property: "no",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "FECHA DE INICIO",
    property: "fechaInicio",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },

  {
    label: "FECHA DE FINAL",
    property: "fechaFinal",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  
  {
    label: "acciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-20"],
  }
];

export const DiasNoLaborablesConfigure: TableColumn<any>[] = [
  {
    label: "NO.",
    property: "idFestivo",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "NOMBRE",
    property: "descripcion",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "FECHA DE INICIO",
    property: "fechaDesde",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },

  {
    label: "FECHA DE FINAL",
    property: "fechaHasta",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },

  {
    label: "acciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-20"],
  }
];

export const VacacionesConfigure: TableColumn<any>[] = [
  {
    label: "NO.",
    property: "no",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "FECHA DE INICIO",
    property: "start",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },

  {
    label: "FECHA DE FINAL",
    property: "end",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  
  {
    label: "Consepto",
    property: "nombre",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },

  {
    label: "Estado",
    property: "estado",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },

  {
    label: "acciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-20"],
  }
];

export const VacacionesDetalleConfigure: TableColumn<any>[] = [
  {
    label: "PERIODO",
    property: "periodo",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },

  {
    label: "VACACIONES",
    property: "vacaciones",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },

  {
    label: "DISFRUTADOS",
    property: "disfrutados",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  
  {
    label: "BALANCE",
    property: "balance",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
];


export const VacacionesTTHHConfigure: TableColumn<any>[] = [
  {
    label: "NO.",
    property: "no",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "NOMBRES Y APELLIDOS",
    property: "nombre",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "CEDULA DE IDENTIDAD",
    property: "ci",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "ESTADO",
    property: "estado",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "FECHA DE SOLICITUD",
    property: "solicitud",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  {
    label: "FECHA DE INICIO",
    property: "start",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  {
    label: "FECHA DE FINAL",
    property: "end",
    type: "text",
    cssClasses: ["font-medium", "colortext","texto"],
  },
  {
    label: "TOTAL DIAS",
    property: "total",
    type: "text",
    cssClasses: ["font-medium", "number"],
  },
  {
    label: "CONSEPTO",
    property: "nombre",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "acciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-20"],
  }
];