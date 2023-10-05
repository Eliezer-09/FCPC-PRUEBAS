import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { DataService } from 'src/app/services/data.service';
import icPerson from '@iconify/icons-ic/person';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icFolder from '@iconify/icons-ic/folder';
import icAtm from '@iconify/icons-ic/local-atm';
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import personAdd from '@iconify/icons-ic/person-add';
import icSearch from '@iconify/icons-ic/twotone-search';
import { ComponentesService } from 'src/app/services/componentes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditosService } from '../creditos/creditos.service';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'vex-atencion-usuario',
  templateUrl: './atencion-usuario.component.html',
  styleUrls: ['./atencion-usuario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class AtencionUsuarioComponent implements OnInit {

  identificacion
  nombre_nuevo
  estado
  esParticipe = undefined
  cargando = false
  icSearch = icSearch;
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;
  icAttachMoney = icAttachMoney
  icFolder = icFolder
  icPerson = icPerson
  icAtm = icAtm
  personAdd = personAdd
  nombre
  nombres
  participe
  tipo
  idEntidad = 0;
  vista = false;
  message:boolean;
  clear:boolean;

  data

  
  constructor(
    private router: Router, 
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private dataComponent: ComponentesService,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private ticketService: TicketsService) { }

  ngOnInit(): void {
  }

  mensajeRecibido($event) {
    this.message = $event
    this.vista = this.message
    this.changeDetector.detectChanges
  }

  limpiarVentana($event){
    this.identificacion = ""
    this.clear = $event
    this.vista = false
    this.esParticipe = undefined
    this.changeDetector.detectChanges
  }

  async buscar(){
    this.idEntidad = 0;
    if(this.identificacion == undefined){
      this.dataComponent.alerta("error", "Por favor ingrese un número de cedula")
    }else{
      if(this.identificacion.length != 10){
        this.dataComponent.alerta("error", "El número de cedula ingresado es demasiado corto");
      }else{
        this.cargando = true;
        await this.dataService.getParticipeByIdentificacion(this.identificacion).subscribe(response =>{
          this.cargando = false
          this.esParticipe = true
          this.estado = response["result"]["estado"]
          this.estado == "Aprobado" ? this.estado = "PARTICIPE ACTIVO" : this.estado == response["estado"]
          //NoDisponible
          this.nombre = response["result"]["razonSocial"]
          this.nombres = response["result"]["nombres"]
          if(response["result"]["direcciones"].length != 0){
            this.idEntidad = response["result"]["direcciones"][0]["idEntidad"];
          }
          this.changeDetector.detectChanges()
        }, error => {
          this.esParticipe = false
          this.cargando = false
          this.changeDetector.detectChanges()
        });
      }
    }
  }

  aderir(){
    this.spinner.show();
    if(this.nombre_nuevo == undefined){
      this.dataComponent.alerta("info", "Por favor ingrese su nombre para continuar")
      this.spinner.hide();
    }else{
      this.ticketService.postTicketCreate(this.identificacion, this.nombre_nuevo, 11, this.idEntidad).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Ticket Generado")
          this.esParticipe = undefined
          this.identificacion = undefined
          this.nombre_nuevo = undefined
          this.idEntidad = 0;
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.esParticipe = undefined
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }
      })
    }
  }

  aderirPasivo(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre, 11, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.esParticipe = undefined
        this.identificacion = undefined
        this.nombre_nuevo = undefined
        this.idEntidad = 0;
        this.changeDetector.detectChanges()
        this.spinner.hide()
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.esParticipe = undefined
        this.changeDetector.detectChanges()
        this.spinner.hide()
      }
    })
  }

  cuentaIndividual(){
    //this.router.navigateByUrl("/solicitar-ticket/cuentaIndividual")
    this.spinner.show();
    if(this.nombre_nuevo == undefined){
      this.dataComponent.alerta("info", "Por favor ingrese su nombre para continuar")
      this.spinner.hide();
    }else{
      this.ticketService.postTicketCreate(this.identificacion, this.nombre_nuevo, 4, this.idEntidad).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Ticket Generado")
          this.esParticipe = undefined
          this.identificacion = undefined
          this.nombre_nuevo = undefined
          this.idEntidad = 0;
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.esParticipe = undefined
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }
      })
    }
  }

  oficio(){
    this.spinner.show();
    if(this.nombre_nuevo == undefined){
      this.dataComponent.alerta("info", "Por favor ingrese su nombre para continuar")
      this.spinner.hide();
    }else{
      this.ticketService.postTicketCreate(this.identificacion, this.nombre_nuevo, 12, this.idEntidad).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Ticket Generado")
          this.esParticipe = undefined
          this.identificacion = undefined
          this.nombre_nuevo = undefined
          this.idEntidad = 0;
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.esParticipe = undefined
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }
      })
    }
  }

  consultaDeuda(){
    this.spinner.show();
    if(this.nombre_nuevo == undefined){
      this.dataComponent.alerta("info", "Por favor ingrese su nombre para continuar")
      this.spinner.hide();
    }else{
      this.ticketService.postTicketCreate(this.identificacion, this.nombre_nuevo, 13, this.idEntidad).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Ticket Generado")
          this.esParticipe = undefined
          this.identificacion = undefined
          this.nombre_nuevo = undefined
          this.idEntidad = 0;
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.esParticipe = undefined
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }
      })
    }
  }

  consultaDeudaPasivos(){
    this.spinner.show();
    if(this.nombre_nuevo == undefined){
      this.dataComponent.alerta("info", "Por favor ingrese su nombre para continuar")
      this.spinner.hide();
    }else{
      this.ticketService.postTicketCreate(this.identificacion, this.nombre_nuevo, 14, this.idEntidad).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Ticket Generado")
          this.esParticipe = undefined
          this.identificacion = undefined
          this.nombre_nuevo = undefined
          this.idEntidad = 0;
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.esParticipe = undefined
          this.changeDetector.detectChanges()
          this.spinner.hide();
        }
      })
    }
  }

  serviciosParticipe(){
    this.vista = true
    this.tipo = "servicios_participe"
    this.data = {
      "cedula": this.identificacion,
      "nombre": this.nombres,
      "razonSocial": this.nombre,
      "estado": this.estado,
      "tipo": this.tipo,
      "idEntidad": this.idEntidad,
    }
    this.participe = this.data
    this.changeDetector.detectChanges()
  }

  credito(){
    this.vista = true
    this.tipo = "credito"
    this.data = {
      "cedula": this.identificacion,
      "nombre": this.nombres,
      "razonSocial": this.nombre,
      "estado": this.estado,
      "tipo": this.tipo,
      "idEntidad": this.idEntidad,
    }
    this.participe = this.data
    this.changeDetector.detectChanges()
  }

  creditos(){
    this.vista = true
    this.tipo = "creditos"
    this.data = {
      "cedula": this.identificacion,
      "nombre": this.nombres,
      "razonSocial": this.nombre,
      "estado": this.estado,
      "tipo": this.tipo,
      "idEntidad": this.idEntidad,
    }
    this.participe = this.data
    this.changeDetector.detectChanges()
  }

  legal(){
    this.vista = true
    this.tipo = "legal"
    this.data = {
      "cedula": this.identificacion,
      "nombre": this.nombres,
      "razonSocial": this.nombre,
      "estado": this.estado,
      "tipo": this.tipo,
      "idEntidad": this.idEntidad,
    }
    this.participe = this.data
    this.changeDetector.detectChanges()
  }

  cesantia(){
    this.vista = true
    this.tipo = "cesantia"
    this.data = {
      "cedula": this.identificacion,
      "nombre": this.nombres,
      "razonSocial": this.nombre,
      "estado": this.estado,
      "tipo": this.tipo,
      "idEntidad": this.idEntidad,
    }
    this.participe = this.data
    this.changeDetector.detectChanges()
  }
    
}
