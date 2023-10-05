import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import icGroup from '@iconify/icons-ic/group';
import icPerson from '@iconify/icons-ic/person';
import icDescription from '@iconify/icons-ic/description';
import icMoney from '@iconify/icons-ic/monetization-on';
import icHelp from '@iconify/icons-ic/help';
import icShare from '@iconify/icons-ic/twotone-share';
import icLocationCity from '@iconify/icons-ic/location-city';
import icPhone from '@iconify/icons-ic/phone';
import icAssignment from '@iconify/icons-ic/assignment-ind';
import icEmail from '@iconify/icons-ic/email';
import icSearch from '@iconify/icons-ic/twotone-search';
import icCreditCard from '@iconify/icons-ic/credit-card';
import { ComponentesService } from 'src/app/services/componentes.service';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NGXLogger } from 'ngx-logger';
import { TicketsService } from '../tickets.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'vex-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [DatePipe]
})
export class ModalInfoComponent implements OnInit {

  icHelp = icHelp;
  icShare = icShare;
  icGroup = icGroup;
  icPerson = icPerson
  icDescription = icDescription
  icMoney = icMoney
  icLocationCity = icLocationCity
  icPhone = icPhone
  icAssignment = icAssignment
  icEmail = icEmail
  icSearch = icSearch
  icCreditCard = icCreditCard

  fotoPerfil;
  participe;
  telefono;
  correo;
  estado;
  codigo;
  direccion;
  razon;
  tarea;
  usuario;
  idUsuario;
  ticketData;
  codigoTicket;
  horaEmision;
  idTipoTarea;
  identificacion;
  tipo;
  tareas = [];
  tiposReferido = [];
  asunto;
  descripcion;
  referido;
  tipoTarea;

  constructor(
    private dataComponent: ComponentesService,
    private data: DataService,
    @Inject(MAT_DIALOG_DATA) public dataModal: ModalInfoComponent,
    private spinner: NgxSpinnerService,
    private changeDetectorRefs: ChangeDetectorRef,
    private datePipe: DatePipe,
    private logger: NGXLogger,
    private ticketService: TicketsService,
    private authService: AuthService) { }

  ngOnInit(): void {

    var loggedData = this.authService.logeado()
    this.logger.log(loggedData);
    this.usuario = loggedData["fcpc://fullname"]
    this.idUsuario = loggedData["fcpc://id"]

    this.spinner.show();
    this.cargarReferencias();
    this.cargarTareaComentarios();
    this.ticketData = this.ticketService.getTicketById(this.dataModal["idTicket"]);
    this.identificacion = this.dataModal["identificacion"];
    this.tipo = this.dataModal["tipo"];
    
    this.ticketService.getTicketById(this.dataModal["idTicket"]).subscribe(res => {
      this.codigoTicket = res["result"]["codigo"];
      this.idTipoTarea = res["result"]["idTipoTarea"];
      this.tipoTarea = res["result"]["tipoTarea"];
    });

    this.ticketService.getTareaById(this.dataModal["idTarea"]).subscribe(res => {
      this.asunto = res["result"]["titulo"]
      this.descripcion = res["result"]["descripcion"];
      this.changeDetectorRefs.detectChanges()
    });

    this.horaEmision = this.datePipe.transform(this.dataModal["horaEmitido"], "h:mm a");

    this.data.getParticipeByIdentificacion(this.dataModal["identificacion"]).subscribe(response => {
      this.telefono = response["result"]["telefono1"];
      this.correo = response["result"]["correo1"];
      if(response["result"]["direcciones"].length != 0){
        this.direccion = response["result"]["direcciones"][0]["callePrincipal"];
      }else{
        this.direccion = "No hay direcciones ingresadas";
      }
      this.estado = response["result"]["estado"];
      this.codigo = response["result"]["codigoUniformado"];
      this.razon = response["result"]["razonSocial"];
      this.spinner.hide();
    }, error =>{
      this.ticketData.subscribe(response => {
        this.telefono = "No especificado"
        this.correo = "No especificado"
        this.direccion = "No especificado"
        this.estado = "NO ADHERIDO"
        this.codigo = "N/A"
        this.razon = response["result"]["nombre"]
        this.spinner.hide();
      })
    });
    this.changeDetectorRefs.detectChanges();
  }

  atender(){
    this.dataComponent.alertaButtons("¿Desea atender este ticket?").then((result) =>{
      if(result.isConfirmed){
        this.ticketService.postAtenderTicket(this.dataModal["idTicket"], this.usuario, this.idUsuario).subscribe(response => {
          var idTarea = response["result"]["idTarea"]
          window.open("/tickets/tareas-ticket/" + this.dataModal["idTicket"] + "/" + this.dataModal["identificacion"] + "/" + idTarea)
          this.logger.log(response)
          location.reload()
        }, error => {
          this.dataComponent.alerta("error", error["error"]["message"]);
        });
      }
    })
  }

  finalizar(){
    if(this.tareas.length != 0){
      if(this.referido != undefined){
        this.dataComponent.alertaButtons("¿Desea finalizar este ticket?").then((result) =>{
          if(result.isConfirmed){
            this.ticketService.postFinalizarTicket(this.dataModal["idTicket"], this.referido).subscribe(response => {
              if(response["success"] == true){
                this.spinner.hide();
                //this.router.navigateByUrl('/tickets');
                Swal.fire({
                  icon: "success",
                  title: "Turno finalizado!",
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                }).then((result) =>{
                  if(result.isConfirmed){
                    location.reload()
                  }
                })
              }else{
                this.spinner.hide();
                this.dataComponent.alerta("error", "Error al finalizar tarea!")
              }
            })
          }
        })
      }else{
        this.dataComponent.alerta("error", "Debe seleccionar como se entero de los servicios!")
      }
    }else{
      this.dataComponent.alerta("error", "No hay tareas agregadas!");
    }
  }

  cargarTareaComentarios(){
    this.ticketService.getComentariosByIdTarea(this.dataModal["idTarea"]).subscribe(response => {
      this.tareas = response["result"]
      this.tareas.reverse();
      this.changeDetectorRefs.detectChanges()
    })
  }

  enviarComentarios(){
    if(this.tarea == "" || this.tarea == undefined){
      this.dataComponent.alerta("error", "Por favor escriba un comentario");
    }else{
      this.spinner.show();
      this.ticketService.postTareaComentarios(this.dataModal["idTarea"], this.idUsuario, this.usuario, this.tarea).subscribe(response => {
        if(response["success"] == true){
          this.dataComponent.alerta("success", "Comentario agregado correctamente")
          this.cargarTareaComentarios()
          this.tarea = ""
          this.spinner.hide();
        }else{
          this.dataComponent.alerta("error", response["message"])
          this.spinner.hide();
        }
      })
    }
  }

  cargarReferencias(){
    this.ticketService.getTiposReferencia().subscribe(response => {
      this.tiposReferido = response["result"]
      this.changeDetectorRefs.detectChanges()
    });
  }

  seleccionarReferencia(idReferido){
    this.referido = idReferido;
  }

}
