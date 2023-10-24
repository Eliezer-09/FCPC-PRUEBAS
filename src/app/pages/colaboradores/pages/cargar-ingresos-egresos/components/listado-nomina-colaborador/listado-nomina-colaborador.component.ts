import { Component, OnInit, ViewChild, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { DataService } from 'src/app/services/data.service';
import { TTHHColaboradorService } from '../../../../services/tthh-colaborador.service';
import { MatAccordion } from '@angular/material/expansion';
import { NominaNoProcesada } from '../../../../models/nomina';
import * as FileSaver from "file-saver";
import { UtilsService } from '../../../../utils/utils.service';

@UntilDestroy()
@Component({
  selector: 'vex-listado-nomina-colaborador',
  templateUrl: './listado-nomina-colaborador.component.html',
  styleUrls: ['./listado-nomina-colaborador.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class ListadoNominaColaboradorComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() nominaNoProcesada:NominaNoProcesada[];
  @Input() titleNomina:string=''
  @Input() tipoColaborador:number;
  @Output() download = new EventEmitter();
  
  faSave              = iconfa.faSave;
  icroundFileDownload=iconify.icroundFileDownload;
  habilitarGuardar:boolean=false;
  displayedColumns: string[] = ['rubro', 'monto'];
  templateDiasIngreso = [
    { label: "Días trabajados", value: "diasTrabajo", pre:'' },
    { label: "Días vacaciones", value: "diasVacaciones", pre:''},
    { label: "Días subsidio", value: "diasSubsidio", pre:'' },
    { label: "Días décimo cuarto mensual", value: "diasdecimocuarto", pre:'' },
    { label: "Días décimo tercero mensual", value: "diastercero", pre:'' },
    { label: "Días fondo reserva", value: "diasFondoReserva", pre:'' },
  ];
  task:NominaNoProcesada[]=[]
  allComplete: boolean = false;

  
  layoutCtrl = new FormControl('fullwidth');
  
  constructor(
    public utils: UtilsService
  ) { }

  ngOnInit(): void {

  }

expansiveInitial=true;
  step = 0;

  setStep(index: number) {
    if(this.expansiveInitial) this.expansiveInitial=false;
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nominaNoProcesada?.currentValue) {
      this.task=this.nominaNoProcesada
    }

  }

  updateAllComplete(task) {
    this.allComplete =task != null && task.every(t => t.completed); 
  }

  someComplete(task): boolean {
     if (task == null) {
      return false;
    }
    return task.filter(t => t.completed).length > 0 && !this.allComplete; 
  }

  setAll(task,completed: boolean) {
     this.allComplete = completed;
    if (task == null) {
      return;
    }
    task.forEach(t => (t.completed = completed)); 
  }

}

