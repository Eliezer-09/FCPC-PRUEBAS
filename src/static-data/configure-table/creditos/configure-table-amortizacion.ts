import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const TablaSimunacionAmortizacionConfigure: TableColumn<any>[] =  [
    {
      label: '#',
      property: 'numCuota',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
    {
      label: 'Fecha',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    }, 
    {
      label: 'Interés',
      property: 'interes',
      footerProperty:'totalInteres',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Capital',
      property: 'capital',
      footerProperty:'totalCapital',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Cuota',
      property: 'cuota',
      footerProperty:'totalCuota',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Desgravamen',
      property: 'desgravamen',
      footerProperty:'totalDesgravamen',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Total ',
      subLabel:'(Cuota + Desgravamen)',
      property: 'total',
      footerProperty:'totalCD',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Saldo',
      property: 'saldo',
      footerProperty:'totalSaldo',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },

  ];


  export const TablaSimunacionAmortizacionRestructuracionConfigure: TableColumn<any>[] =  [
    {
      label: '#',
      property: 'numCuota',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
     {
      label: 'Fecha',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
    {
      label: 'Interés',
      property: 'interes',
      footerProperty:'totalInteres',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Interés Reprogramado',
      property: 'valorDiferido',
      footerProperty:'totalInteresReprogramado',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Capital',
      property: 'capital',
      footerProperty:'totalCapital',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Cuota',
      property: 'cuota',
      footerProperty:'totalCuota',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Desgravamen',
      property: 'desgravamen',
      footerProperty:'totalDesgravamen',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Interés Vencido',
      property: 'interesVencido',
      footerProperty:'totalInteresVencido',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Total ',
      subLabel:'(Cuota + Desgravamen)',
      property: 'total',
      footerProperty:'totalCD',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Saldo',
      property: 'saldo',
      footerProperty:'totalSaldo',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },

  ];

  export const PagoIndividualPagosAplicarConfigure: TableColumn<any>[] =  [
    {
      label: 'No. Operación',
      property: 'idPrestamo',
      type: 'text',
      cssClasses: ['font-medium','number','colortext']
    },
    {
      label: 'N° Cuota',
      property: 'cuota',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
     {
      label: 'Fecha',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    }, 
    {
      label: 'Capital',
      property: 'capital',
      footerProperty:'totalCapital',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Interés',
      property: 'interes',
      footerProperty:'totalInteres',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Mora',
      property: 'mora',
      footerProperty:'totalMora',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Desgravamen',
      property: 'desgravamen',
      footerProperty:'totalDesgravamen',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Total ',
      property: 'total',
      footerProperty:'total',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },

  ];

  
  export const TablaAmortizacionActualizadaConfigure: TableColumn<any>[] =  [
    {
      label: 'N° Cuota',
      property: 'numCuota',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
     {
      label: 'Fecha',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    }, 
    {
      label: 'Capital',
      property: 'capital',
      footerProperty:'totalCapital',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Interés',
      property: 'interes',
      footerProperty:'totalInteres',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Cuota',
      property: 'cuota',
      footerProperty:'totalCuota',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Mora',
      property: 'mora',
      footerProperty:'totalMora',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Desgravamen',
      property: 'desgravamen',
      footerProperty:'totalDesgravamen',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },
    {
      label: 'Total ',
      subLabel:'(Cuota + Desgravamen)',
      property: 'total',
      footerProperty:'total',
      type: 'text',
      cssClasses: ['font-medium','decimal']
    },

  ];