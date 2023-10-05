import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { DataService } from 'src/app/services/data.service';
import { CreditosService } from 'src/app/pages/creditos/creditos.service';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { formatDate } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';


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
  parameters = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    id: new FormControl(),
  });
  faSave              = iconfa.faSave;
  @Output() guardar= new EventEmitter();
  @Output() changeController= new EventEmitter();
  id =new FormControl()
  idSearch=1221
  icroundFileUpload= iconify.icroundFileUpload;
  habilitarGuardar:boolean=false;
  icroundSearch=iconify.icroundSearch;
  filters = {
    id: null,
    desde: null,
    hasta: null,
  };

  
  templateDiasIngreso = [
    { label: "Días trabajados", value: "diasTrabajo", pre:'' },
    { label: "Días vacaciones", value: "diasVacaciones", pre:''},
    { label: "Días subsidio", value: "diasSubsidio", pre:'' },
    { label: "Días décimo cuarto mensual", value: "diasdecimocuarto", pre:'' },
    { label: "Días décimo tercero mensual", value: "diastercero", pre:'' },
    { label: "Días fondo reserva", value: "diasFondoReserva", pre:'' },
  ];


  task = {
    name: 'Indeterminate',
    subtasks: [
      {
        nombre:"Luis Garcia",
        diasTrabajo:400,
        diasVacaciones:15,
        diasSubsidio:23,
        diasdecimocuarto:16,
        diastercero: 10,
        diasFondoReserva:4,
        completed:false
      },
      {
        nombre:"Marisa Peñafiel",
        diasTrabajo:520,
        diasVacaciones:20,
        diasSubsidio:43,
        diasdecimocuarto:36,
        diastercero: 14,
        diasFondoReserva:8,
        completed:false
      },
      {
        nombre:"Ronald Solorzano",
        diasTrabajo:200,
        diasVacaciones:10,
        diasSubsidio:13,
        diasdecimocuarto:16,
        diastercero: 8,
        diasFondoReserva:2,
        completed:false
      }
    ]
  };

  allComplete: boolean = false;


  confirmCheck(){
    let comfirm=this.task.subtasks.filter(t => !t.completed)
    if(comfirm.length>0){
      try {
          new ToastAlertComponent(
              "info",
              "Debes confimar todos los datos"
          );
      } finally {  }
    }
  }
  updateAllComplete() {
    this.allComplete =this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  layoutCtrl = new FormControl('fullwidth');
  
  constructor(
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private componentesService: ComponentesService,
    private dataService: DataService,
    private fb: FormBuilder,
    private tthhColaboradorService: TTHHColaboradorService
  ) { }

  ngOnInit(): void {
    
  }


  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  generar(){

  }

    getComprobantes(page, size) {
  /*   this._comprobanteService
      .getComprobantesByTermino(this.filters, page, size)
      .pipe(
        map((empelados: OperationResultParticipe) => {
          this.isLoading = false;
          this.comprobantesResult = empelados;
          this.dataFondoSource.data =
            empelados["result"].length > 0 ? empelados["result"] : [];
        })
      )
      .subscribe(
        (res) => {},
        (error) => {
          this.dataFondoSource.data = [];
          this.isLoading = false;
        }
      ); */
  }
  promiseRange = async (
    desde,
    hasta
  ): Promise<Record<string, number | string>> => {
    const response = await this.formatDate(desde, hasta);
    return response;
  };

  formatDate(desde?, hasta?) {
    let range;
    if (desde && hasta) {
      const fechaDesde = formatDate(desde, "yyyy-MM-dd", "en-US");
      const fechaHasta = formatDate(hasta, "yyyy-MM-dd", "en-US");
      range = { fechaDesde: fechaDesde, fechaHasta: fechaHasta };
    }
    return range;
  }

  
  async searchRangeDate(desde?, hasta?) {
    if (desde == null && hasta == null) {
      this.filters.desde = null;
      this.filters.hasta = null;
      this.parameters.reset();
    /*   this.getComprobantes(1, this.pageSize); */
      return;
    }
    const range = await this.promiseRange(desde, hasta);
    this.filters.desde = range?.fechaDesde || null;
    this.filters.hasta = range?.fechaHasta || null;
  /*   this.getComprobantes(1, this.pageSize); */
  }



}

