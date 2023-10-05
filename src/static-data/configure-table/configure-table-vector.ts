import { TableColumn } from "src/@vex/interfaces/table-column.interface";
 
export const VectoresFijoConfigure: TableColumn<any>[] =  [
    {
      label: 'Emisor',
      property: 'nombreEmisor',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'Título',
      property: 'nombreTitulo',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'Código',
      property: 'codigo',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
    {
      label: 'Calificación',
      property: 'calificacion',
      type: 'text',
      cssClasses: ['font-medium','texto-No-Capital']
    },
    {
      label: 'Fecha Corte',
      property: 'fechaCorte',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
    {
      label: 'Fecha Vencimiento',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
    {
      label: 'Tasa Interés cupón',
      property: 'tasaInteresCupon',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
    {
      label: 'Tasa Referencia',
      property: 'tasaReferencia',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
    {
      label: 'Margen',
      property: 'margen',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
    {
      label: 'Tasa Efectiva',
      property: 'tasaEfectiva',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
    {
      label: 'Tasa Nominal',
      property: 'tasaNominal',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
    {
      label: 'Precio',
      property: 'precio',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },
  ];

  export const VectoresVariableConfigure: TableColumn<any>[] =  [
    {
      label: 'Emisor',
      property: 'nombreEmisor',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
  
    {
      label: 'Fecha Corte',
      property: 'fechaCorte',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
    {
      label: 'Fecha Vencimiento',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
  
    {
      label: 'Precio',
      property: 'precio',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
  ];

  export const VectorFijoConfigure: TableColumn<any>[] =  [
    {
      label: "Precio",
      property: "precio",
      type: "text",
      cssClasses: ["font-medium", 'decimal-porcent'],
    },
    {
      label: "Fecha de valoración",
      property: "fecha",
      type: "text",
      cssClasses: ["font-medium", 'fecha'],
    },
    {
      label: 'Calificación',
      property: 'calificacion',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
    {
      label: "Margen",
      property: "margen",
      type: "text",
      cssClasses: ["font-medium",'decimal-porcent'],
    },
    {
      label: "Tasa Efectiva",
      property: "tasaEfectiva",
      type: "text",
      cssClasses: ["font-medium", 'decimal-porcent'],
    },
    {
      label: "Tasa Referencia",
      property: "tasaReferencia",
      type: "text",
      cssClasses: ["font-medium", 'decimal-porcent'],
    },
    {
      label: "Tasa Nominal",
      property: "tasaNominal",
      type: "text",
      cssClasses: ["font-medium",'decimal-porcent'],
    },
    {
      label: "Tasa Interés Cupón",
      property: "tasaInteresCupon",
      type: "text",
      cssClasses: ["font-medium", 'decimal-porcent'],
    },
  ];