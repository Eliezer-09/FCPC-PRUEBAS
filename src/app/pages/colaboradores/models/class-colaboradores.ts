import { TTHHColaboradorService } from "../services/tthh-colaborador.service";
import { DetalleListadoNominaNoProcesada, DetalleNominaNoProcesada } from "./nomina";

export class CargaIngresosEgresos {
    idEntidad: number;
    rubro: string;
    valor: number;
    fecha: string;
  
    constructor(data: any) {
      this.idEntidad = data.idEntidad;
      this.rubro = data.rubro;
      this.valor = data.valor;
      this.fecha = data.fecha;
    }
  
  }


  export class BuildNominaNoPorcesada {
    nombre: string;
    idEntidad: number;
    idNominaCabecera: number;
    totalNeto: DetalleNominaNoProcesada;
    detalleIngreso:DetalleListadoNominaNoProcesada={
      decimal:[],
      unidad:[],
      total:null
    }
    detalleEgresos:DetalleListadoNominaNoProcesada={
      decimal:[],
      unidad:[],
      total:null
    }
    completed:boolean=false;
    idTipoColaborador:number;
    constructor(data: any,dataColaborador:any,private tthhColaboradorService: TTHHColaboradorService) {
      this.idNominaCabecera=data.idNominaCabecera;
      this.idEntidad = data.idEntidad;
      this.asignaTipoMovimiento(data.nominaDetalle);
      this.idTipoColaborador=data.idTipoColaborador;
      this.nombre=dataColaborador.nombres+' '+dataColaborador.apellidos; 
    }

    asignaTipoMovimiento(nominaDetalle){
      nominaDetalle.forEach(detalleNomina => {
      let format='decimal';
      if(detalleNomina.rubro.toLowerCase().includes("porcentaje")) format='porcent'
      if(detalleNomina.rubro.toLowerCase().includes("dias") || detalleNomina.rubro.toLowerCase().includes("cantidad")) format='text'
      let detalle={
        monto:detalleNomina.monto || 0.00,
        rubro: detalleNomina.rubro,
        formato: format
      }

      switch(detalleNomina.tipoMovimiento){
        case 'I':
          format=='text'?this.detalleIngreso.unidad.push(detalle):this.detalleIngreso.decimal.push(detalle)
          break;
        case 'E':
        case 'C':
          format=='text'?this.detalleEgresos.unidad.push(detalle):this.detalleEgresos.decimal.push(detalle)
          break;
         case 'T':
          if(detalleNomina.rubro.toLowerCase().includes('ingreso')) this.detalleIngreso.total=detalle
          if(detalleNomina.rubro.toLowerCase().includes('egresos')) this.detalleEgresos.total=detalle
          if(detalleNomina.rubro.toLowerCase().includes('neto')) this.totalNeto=detalle
          break;
      }
    });
    }
  
  }
