import { ConditionalExpr } from '@angular/compiler';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import personAdd from '@iconify/icons-ic/person-add';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icFolder from '@iconify/icons-ic/folder';
import icLeft from '@iconify/icons-ic/arrow-back';
import icStore from '@iconify/icons-ic/store-mall-directory';
import icHospital from '@iconify/icons-ic/local-hospital';
import icRefresh from '@iconify/icons-ic/autorenew';
import icSign from '@iconify/icons-ic/border-color';
import icPerson from '@iconify/icons-ic/person';
import { NgxSpinnerService } from 'ngx-spinner';
import { TicketsService } from '../tickets.service';

@Component({
  selector: 'vex-solicitar-ticket',
  templateUrl: './solicitar-ticket.component.html',
  styleUrls: ['./solicitar-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitarTicketComponent implements OnInit {
  servicio:any = this.route.snapshot.paramMap.get('servicio');
  identificacion; 
  nombre;
  bandera = false;
  cargando = false;
  icSearch = icSearch;
  personAdd = personAdd;
  icAttachMoney = icAttachMoney;
  icFolder = icFolder;
  icLeft = icLeft;
  icHospital = icHospital;
  icStore = icStore;
  icRefresh = icRefresh;
  icSign = icSign;
  icPerson = icPerson;
  @Input()
  participe: string;
  nombre_completo
  estado
  tipo
  idEntidad = 0;
  valor = false
  clear = false
  visible = true;
  @Output() messageEvent = new EventEmitter<boolean>();
  @Output() clearEvent = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dataComponent: ComponentesService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
    private ticketService: TicketsService) { }

  ngOnInit() {
    this.nombre = this.participe["nombres"]
    this.nombre_completo = this.participe["razonSocial"]
    this.estado = this.participe["estado"]
    this.estado == "Aprobado" ? this.estado = "PARTICIPE ACTIVO" : this.estado == this.participe["estado"]
    this.tipo = this.participe["tipo"]
    this.identificacion = this.participe["cedula"]
    this.idEntidad = this.participe["idEntidad"];
    this.changeDetector.detectChanges();
  }

  return(){
    this.messageEvent.emit(this.valor)
  }

  cuentaIndividual(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 4, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  cruceCuentas(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 5, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  consultaDeuda(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 13, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  creditoQuirografario(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 15, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }
  
  creditoPrendario(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 16, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }
  
  creditoHipotecario(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 17, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  actualizacionAportes(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 18, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  cesante(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 20, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  PagoBeneficiarios(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 21, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  oficio(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 12, this.idEntidad).subscribe(response =>{
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    });
  }

  creditoNuevo(){
    this.visible = false;
  }

  consultaCredito(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 2, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  pagos(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 3, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  firmaPagare(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 6, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.spinner.hide();
        this.clearEvent.emit(this.clear)
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  firmaPagareGarante(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 19, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.spinner.hide();
        this.clearEvent.emit(this.clear)
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  coactivas(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 7, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  reclamos(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 8, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

  solicitudCesantia(){
    this.visible = false;
  }

  otros(){
    this.spinner.show();
    this.ticketService.postTicketCreate(this.identificacion, this.nombre_completo, 10, this.idEntidad).subscribe(response => {
      if(response["success"] == true){
        this.dataComponent.alerta("success", "Ticket Generado")
        this.clearEvent.emit(this.clear)
        this.spinner.hide();
      }else{
        this.dataComponent.alerta("error", response["message"])
        this.spinner.hide();
      }
    })
  }

}
