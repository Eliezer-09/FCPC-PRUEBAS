import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ComponentesService } from 'src/app/services/componentes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TicketsService } from '../tickets.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'vex-tareas-ticket',
  templateUrl: './tareas-ticket.component.html',
  styleUrls: ['./tareas-ticket.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class TareasTicketComponent implements OnInit {

  fotoPerfil;
  participe;
  idTicket:any = this.route.snapshot.paramMap.get('idticket');
  identificacion:any = this.route.snapshot.paramMap.get('identificacion');
  idTarea:any = this.route.snapshot.paramMap.get('idTarea');
  telefono;
  correo;
  estado;
  codigo;
  direccion;
  razon;
  tarea;
  usuario;
  idUsuario;
  tareas = [];
  tiposReferido = [];
  ticketData;
  codigoTicket;
  idTipoTarea;
  esInterno = false;
  asunto;
  descripcion;
  referido;
  tipoTarea;

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

  constructor(private data: DataService, 
    private route: ActivatedRoute,
    private dataComponent: ComponentesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,
    private ticketService: TicketsService,
    private authService: AuthService,) { }

  ngOnInit() {
    this.identificacion == '0000000000' ? this.esInterno = true : this.esInterno = false;
    this.spinner.show();
    this.cargarTareaComentarios();
    this.cargarReferencias();
    var loggedData = this.authService.logeado()
    this.usuario = loggedData["fcpc://fullname"]
    this.idUsuario = loggedData["fcpc://id"]
    
    this.ticketData = this.ticketService.getTicketById(this.idTicket)

    if(!this.esInterno){
      this.ticketService.getTicketById(this.idTicket).subscribe(res => {
        this.codigoTicket = res["result"]["codigo"]
        this.idTipoTarea = res["result"]["idTipoTarea"]
        this.tipoTarea = res["result"]["tipoTarea"]
        this.spinner.hide();
        this.changeDetectorRefs.detectChanges()
      })
      
      this.data.getParticipeByIdentificacion(this.identificacion).subscribe(response => {
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
          this.estado = "N/A"
          this.codigo = "N/A"
          this.razon = response["result"]["nombre"]
          this.spinner.hide();
        })
      });
    }else{
      this.ticketData.subscribe(response => {
        this.codigoTicket = response["result"]["codigo"]
        this.razon = response["result"]["nombre"]
        this.spinner.hide();
      })

      this.ticketService.getTareaById(this.idTarea).subscribe(res => {
        this.asunto = res["result"]["titulo"]
        this.descripcion = res["result"]["descripcion"];
        this.changeDetectorRefs.detectChanges()
      })
    }
  }

  cargarTareaComentarios(){
    this.ticketService.getComentariosByIdTarea(this.idTarea).subscribe(response => {
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
      this.ticketService.postTareaComentarios(this.idTarea, this.idUsuario, this.usuario, this.tarea).subscribe(response => {
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

  finalizarTarea(){
    if(this.tareas.length != 0){
      if(this.referido != undefined){
        this.dataComponent.alertaButtons("Una vez finalizada no podra ingresar mas tareas. \n¿Finalizar Tarea?").then((result) => {
          if(result.isConfirmed){
            this.spinner.show();
            this.ticketService.postFinalizarTarea(this.idTarea, this.referido).subscribe(response => {
              if(response["success"] == true){
                this.spinner.hide();
                //this.router.navigateByUrl('/tickets');
                Swal.fire({
                  icon: "success",
                  title: "Turno finalizado!",
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                }).then((res) =>{
                  if(res.isConfirmed){
                    window.close();
                  }
                })
              }else{
                this.spinner.hide();
                this.dataComponent.alerta("error", "Error al finalizar tarea!")
              }
            })
          }else{
            this.spinner.hide();
          }
        })
      }else{
        this.dataComponent.alerta("error", "Debe seleccionar como se entero de los servicios!");
      }
    }else{
      this.dataComponent.alerta("error", "Debe agregar por lo menos una tarea para finalizar la atención");
    }
  }

  finalizarTareaInterna(){
    if(this.tareas.length != 0){
      this.dataComponent.alertaButtons("Una vez finalizada no podra ingresar mas tareas. \n¿Finalizar Tarea?").then((result) => {
        if(result.isConfirmed){
          this.spinner.show();
          this.ticketService.postFinalizarTareaInterna(this.idTarea).subscribe(response => {
            if(response["success"] == true){
              this.spinner.hide();
              Swal.fire({
                icon: "success",
                title: "Turno finalizado!",
                showCancelButton: false,
                confirmButtonText: `Ok`,
              }).then((res) =>{
                if(res.isConfirmed){
                  window.close();
                }
              })
            }else{
              this.spinner.hide();
              this.dataComponent.alerta("error", "Error al finalizar tarea!")
            }
          })
        }else{
          this.spinner.hide();
        }
      })
    }else{
      this.dataComponent.alerta("error", "Debe agregar por lo menos una tarea para finalizar la atención");
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
