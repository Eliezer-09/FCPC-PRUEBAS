import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { NominaNoProcesada } from '../../../models/nomina';
import { BuildNominaNoPorcesada } from '../../../models/class-colaboradores';

@UntilDestroy()
@Component({
  selector: 'vex-seccion-buscar-ingresos-egresos',
  templateUrl: './seccion-buscar-ingresos-egresos.component.html',
  styleUrls: ['./seccion-buscar-ingresos-egresos.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class SeccionBuscarIngresosEgresosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  nominaNoProcesada:NominaNoProcesada[];
  listadoNominaNoProcesada=[];
  parameters = this.fb.group({
    filtro:[true,Validators.required],
    mes: [],
    anio: [],
    codigoNomina: [],
  });
  faSave              = iconfa.faSave;
  @Input() codigoNominaI:number;
  @Output() guardar= new EventEmitter();
  idSearch=1221
  icroundFileUpload= iconify.icroundFileUpload;
  habilitarGuardar:boolean=false;
  icroundSearch=iconify.icroundSearch;
  date = new FormControl();
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.codigoNominaI?.currentValue) {
      this.parameters.controls.codigoNomina.setValue(this.codigoNominaI);
      this.cargar();
    }

  }

  layoutCtrl = new FormControl('fullwidth');
  
  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private tthhColaboradorService: TTHHColaboradorService,
    private componentService: ComponentesService,
  ) { }

  ngOnInit(): void {
    this.reset()
  }

  cargar() {
    this.spinner.show()
    const codigoNomina=this.parameters.value.codigoNomina;
    const mes=this.parameters.value.mes;
    const anio=this.parameters.value.anio;
    const filtro=this.parameters.value.filtro;
    let data={code:codigoNomina,mes:null,anio:null};
    if(filtro) data={code:null,mes:mes,anio:anio}
    this.listadoNominaNoProcesada=[];
        this.tthhColaboradorService.getNominaDetalle(data).subscribe((nomina) => {
         this.nominaNoProcesada=nomina.result;
         if( this.nominaNoProcesada.length>0){
          this.getInfoColaboradores(this.nominaNoProcesada).then(colaboradores => {
            if(colaboradores.length>0){
              this.nominaNoProcesada.forEach(data => {
                let dataColaborador=colaboradores.filter( (colaborador) => colaborador.idEntidad == data.idEntidad)
                if(dataColaborador.length>0) dataColaborador=dataColaborador[0]
                this.listadoNominaNoProcesada.push(new BuildNominaNoPorcesada(data,dataColaborador,this.tthhColaboradorService))
              });
      
              this.parameters.controls.codigoNomina.setValue(this.nominaNoProcesada[0].idCargaNomina)
            }})
          
         }
  
            this.spinner.hide()
          },
          (error) => {
            this.spinner.hide();
            this.nominaNoProcesada=null;
            this.listadoNominaNoProcesada=[];
            this.componentService.alerta("error", error)
        })
    }

    getInfoColaboradores( nominaNoProcesada){
      let data=[]
      nominaNoProcesada.forEach(element => {
        data.push({
          idEntidad:element.idEntidad
        });
      });

      const colaboradores = new Promise<any>((resolve, reject) => {

        this.tthhColaboradorService.loadColaboradoresData(data,null, null ) .subscribe(
          (data) => { 
            const datos=data["result"];
            resolve(datos);
          },
          (error) => {
            resolve([]);
            console.log(error);
        });
    
      });
      return  colaboradores.then(value => {return value});
    }

    setMonthAndYear(event): void {
      if (event) {
          this.date.setValue(event)
          this.parameters.controls.mes.setValue(event.month() + 1);
          this.parameters.controls.anio.setValue(event.year());
          this.parameters.controls.codigoNomina.setValue(null);
      } else {
        this.parameters.controls.mes.setValue(null);
        this.parameters.controls.anio.setValue(null);
      }
  }

  
  reset(){
    this.parameters.controls.codigoNomina.setValue(null);
    this.date.setValue(moment());
    this.parameters.controls.mes.setValue(this.date.value.month() + 1);
    this.parameters.controls.anio.setValue(this.date.value.year());
  }


}

