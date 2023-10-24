import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import { iconify } from 'src/static-data/icons';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { SeccionBuscarIngresosEgresosComponent } from './seccion-buscar-ingresos-egresos/seccion-buscar-ingresos-egresos.component';


@UntilDestroy()
@Component({
  selector: 'vex-cargar-ingresos-egresos',
  templateUrl: './cargar-ingresos-egresos.component.html',
  styleUrls: ['./cargar-ingresos-egresos.component.scss'],
  animations:[
    stagger80ms,
    fadeInRight400ms
  ]
})
export class CargarIngresosEgresosComponent implements OnInit {

  @ViewChild("seccionBuscarIngresosEgresosComponent")
  seccionBuscarIngresosEgresosComponent: SeccionBuscarIngresosEgresosComponent;
  codigoNomina:number;
  icroundFileDownload=iconify.icroundFileDownload
  icroundFileUpload=iconify.icroundFileUpload
  icroundChecklistRtl=iconify.icroundChecklistRtl
  isUpdate:boolean=false;
  activeCategory=0;
  layoutCtrl = new FormControl('fullwidth');
  //ICONOS
  icroundUploadFile=iconify.icroundUploadFile;
  activeItem = {
    noProcesada: true,
    procesada: false,
    cargarNomina: false
  };
  items = [
    {
      id: 0,
      icon: this.icroundFileUpload,
      label: "Cargar",
    },
    {
      id: 1,
      icon: this.icroundChecklistRtl,
      label: "Validar",
    },
    {
      id: 2,
      icon: this.icroundFileDownload,
      label: "Descargar",
    },
  ];
  constructor(
  ) { }

  ngOnInit() {
    this.activeCategory=JSON.parse(sessionStorage.getItem('activeNominaSelection')) || 0
    if(this.activeCategory>this.items.length) this.activeCategory=0;
    this.filterChange(this.activeCategory)
  }

  
  updateCarga(response:any){
    if(response.action=='carga'){
      this.isUpdate=false;
      if(response.data){
        this.codigoNomina=response.data;
      }
    }else{
      this.isUpdate=true;
     
  }
}

filterChange(category) {
  Object.entries(this.activeItem).forEach((control) => {
    const [key, value] = control;
    this.activeItem[key] = false;
  });
  this.activeItem[category]=true;
  sessionStorage.setItem('activeNominaSelection', JSON.stringify(category))
}

  

}

