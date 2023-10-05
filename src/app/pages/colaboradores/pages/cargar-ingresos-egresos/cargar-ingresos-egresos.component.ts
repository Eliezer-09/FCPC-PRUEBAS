import { Component, OnInit } from '@angular/core';
import {FormControl } from '@angular/forms';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import { iconify } from 'src/static-data/icons';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';


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

  isUpdate:boolean=false;

  layoutCtrl = new FormControl('fullwidth');
  //ICONOS
  icroundUploadFile=iconify.icroundUploadFile;

  constructor(
  ) { }

  ngOnInit(): void {
    
  }
  
  updateCarga(accion:string){
    console.log(accion)
    if(accion=='carga'){
      this.isUpdate=false;
    }else{
      this.isUpdate=true;
  }
}



  

}

