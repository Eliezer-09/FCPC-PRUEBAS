import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { DataService } from 'src/app/services/data.service';
import { iconify } from 'src/static-data/icons';
import { InversionesService } from '../../../inversiones.service';

@Component({
  selector: 'vex-view-emisor',
  templateUrl: './view-emisor.component.html',
  styleUrls: ['./view-emisor.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    fadeInRight400ms
  ],
})
export class ViewEmisorComponent implements OnInit {
  dataEntidadFinanciera;
  idEntidad;
  routerData;
  layoutCtrl = new FormControl('fullwidth');
  icroundBookmark=  iconify.icroundBookmark;
  icroundChevronRight= iconify.icroundChevronRight;
  tiposIdentificaciones :any = [];

  selectSectorInversion :any= [];
  paises                :any[] = [];
  ciudades              :any[] = [];
  provincias            :any[] = [];
  parroquias            :any[] = [];
  esNacional = false;
  formCalificadora: FormGroup=this.fb.group({
    tipoFinanciera:       [""],
    idPais:               [""],
    idTipoIdentificacion: [""],
    tipoIdentificacion:   [""],
    identificacion:       [""],
    razonSocial:          [""],
    codigoSbs:            [""],
    idSectorFinanciero:   [""],
    idProvincia:          [""],
    idCiudad:             [""],
    idParroquia:          [""],
    callePrincipal:       [""],
    calleSecundaria:      [""],
    referencia:           [""],
    celular:              [""],
    telefono1:            [""],
    telefono2:            [""],
    correo1:              [""],
    correo2:              [""],
    web:                  [""],
    entidadFinanciera: {},
    direccion:{}
  });
  constructor( private fb: FormBuilder,    
    private spinner: NgxSpinnerService,    
    private inversionesService: InversionesService, 
    private route: ActivatedRoute,
    private dataService: DataService,) { }

  ngOnInit(): void {
    this. getRouterData()
    this. getIDType()
    this.loadSectordeInversion()
    this.loadPaises()
  }

  
  getRouterData(){
    this.route.paramMap.subscribe(params => {
      this.idEntidad=params.get("id")
      this.getEntidadFinancieraById();
    })
  }

  asingDataToForm(){
    this.formCalificadora.patchValue(this.dataEntidadFinanciera);
    const controlListDirection=["referencia","callePrincipal","calleSecundaria","idPais","idCiudad","idParroquia","idProvincia"]
    controlListDirection.forEach(control => {
      if( this.formCalificadora.controls[control]){
        this.formCalificadora.controls[control].setValue(this.dataEntidadFinanciera["direccion"][control])
      }
    const controlListEntidad=["idSectorFinanciero","codigoSbs"]
    controlListEntidad.forEach(control => {
        if( this.formCalificadora.controls[control]){
          this.formCalificadora.controls[control].setValue(this.dataEntidadFinanciera["entidadFinanciera"][control])
        }
    });
  })
  }
  
  getEntidadFinancieraById(){
    this.spinner.show();
    this.inversionesService.getEntidadFinancieraById(this.idEntidad).subscribe((response: any) => {
      this.dataEntidadFinanciera = response["result"];
      this.asingDataToForm();
      this.fillCombox();
      this.spinner.hide();
    });
  } 


  getIDType(){
    this.dataService.getTiposIdentificaciones('ruc').subscribe( (tiposIdentificaciones:any) => {
      this.tiposIdentificaciones = tiposIdentificaciones
    });
  }


  loadSectordeInversion() {
    this.dataService.getSectorFinanciero().subscribe((response: any) => {
      this.selectSectorInversion = response["result"];
    })
  }

  loadPaises() {
    this.dataService.getPaisById(1).subscribe((res: any) => {
      this.paises = [res];   
    });
  }

  fillCombox(){
    this.filterGetIDType(this.dataEntidadFinanciera["idTipoIdentificacion"]);
    const idPais=this.dataEntidadFinanciera["direccion"]["idPais"]
    if(idPais){
      this.enableDirection(idPais)
      this.loadProvincias();
    }
  }


  filterGetIDType(idTipoIdentificacion){
    let tipoIdentificaciones=this.tiposIdentificaciones.filter(
      (IDType) => IDType.idTipoIdentificacion == idTipoIdentificacion
    )
    if(tipoIdentificaciones.length>0){
      const idTipoIdentificacionform=tipoIdentificaciones[0];
    this.formCalificadora.controls["tipoIdentificacion"].setValue(idTipoIdentificacionform);
    }
  }

  loadProvincias() {
    const idPais=this.formCalificadora.value.idPais
    this.enableDirection(idPais)
    if(idPais){
    this.dataService.getProvincias(idPais).subscribe((res: any) => {
      this.provincias = res;
      this.loadCiudades();
    });
  }
  }

  enableDirection(value){
    if(value == 1){
      this.esNacional = true;
      this.formCalificadora.controls['idCiudad'].enable()
      this.formCalificadora.controls['idProvincia'].enable()
      this.formCalificadora.controls['idParroquia'].enable()
    }else{
      this.esNacional = false;
      this.formCalificadora.controls['idCiudad'].disable()
      this.formCalificadora.controls['idProvincia'].disable()
      this.formCalificadora.controls['idParroquia'].disable()
    }
  }

  loadCiudades() {
    const idProvincia=this.formCalificadora.value.idProvincia
    if(idProvincia){
    this.dataService.getCiudades(idProvincia).subscribe((res: any) => {
        this.ciudades = res;
        this.loadParroquia()
      });
    }
  }

  loadParroquia() {
    const idCiudad=this.formCalificadora.value.idCiudad
    if(idCiudad){
      this.dataService.getParroquias(idCiudad).subscribe( (parroquias:any) => {
        this.parroquias = parroquias;
      });
    }
  }

}
