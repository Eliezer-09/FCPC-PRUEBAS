import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { TicketsService } from 'src/app/pages/tickets/tickets.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from '../../../../app/services/data.service';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { NGXLogger } from 'ngx-logger';
import { Empleado, Ticket } from 'src/app/model/models';
import { HttpError } from '@microsoft/signalr';

@Component({
  selector: 'vex-toolbar-crear-ticket',
  templateUrl: './toolbar-info-ticket.component.html',
  styleUrls: ['./toolbar-info-ticket.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class ToolbarInfoTicketComponent implements OnInit {

  datosTicket: FormGroup;
  empleados;
  funcionario;
  asunto;
  descripcion;
  solicitante;
  emision;
  usuario;
  idUsuario;
  clickAsignar = false;
  empleado: Empleado = {};

  constructor(
    private dataServices: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private authService: AuthService,
    private componentService: ComponentesService,
    private logger: NGXLogger,
    @Inject(MAT_DIALOG_DATA) public ticket: Ticket,
    private dialogRef: MatDialogRef<ToolbarInfoTicketComponent>,
  ) { }

  ngOnInit() {
    this.dataServices.tokenvalido();
    var loggedData = this.authService.logeado();
    this.usuario = loggedData["fcpc://fullname"];
    this.idUsuario = loggedData["fcpc://id"];
    this.funcionario = this.authService.getFuncionario();
    this.datosTicket = this.fb.group({
      idEmpleado: ['', [Validators.required]],
    });
    this.spinner.show();
    this.ticketService.getTareaById(this.ticket.idTarea).subscribe(response => {
      this.spinner.hide();
      this.asunto = response["result"]["titulo"];
      this.descripcion = response["result"]["descripcion"];
    });
    this.solicitante = this.ticket.nombre;
    this.emision = this.ticket.fecha;
    this.changeDetectorRefs.detectChanges();
  }

  atender() {
    this.clickAsignar = false;
    this.componentService.alertaButtons("¿Desea atender este ticket?").then((result) => {
      if (result.isConfirmed) {
        this.logger.log(this.ticket.idTicket);
        this.ticketService.postAtenderTicketInterno(this.ticket.idTicket, this.usuario, this.idUsuario).subscribe(response => {
          this.logger.log(response);
          location.reload();
        });
        window.open("tickets/tareas-ticket/" + this.ticket.idTicket + "/" + this.ticket.identificacion + "/" + this.ticket.idTarea)
      }
    })
  }

  anular() {
    this.clickAsignar = false;
    this.componentService.alertaButtons("Esta por anular este ticket. \n¿Desea continuar?").then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.ticketService.postTicketAnular(this.ticket.idTicket).subscribe(response => {
          if (response["success"] == true) {
            this.spinner.hide();
            this.componentService.alerta("success", "Ticket Anulado!");
            location.reload();
          } else {
            this.spinner.hide();
            this.componentService.alerta("error", "Error al intentar anular el turno!")
          }
        })
      }
    })
  }

  cargarEmpleados() {
    this.clickAsignar = true;
    this.spinner.show();
    this.dataServices.getEmpleadosByDepartamento(this.ticket.idDepartamento).subscribe(response => {
      this.spinner.hide();
      this.empleados = response["result"];
    }, error => {
      this.spinner.hide();
      this.componentService.alerta("error", error)
    })
  }

  cancelar() {
    this.clickAsignar = false;
  }

  setEmpleado(event) {
    this.empleado = event.value;
  }

  asignar() {
    this.componentService.alertaButtons("¿Desea asignar este ticket a " + this.empleado.nombre + "?").then((result) => {
      if (result.isConfirmed) {
        this.ticketService.postAsignarTicket(this.ticket.idTicket, this.empleado.idEmpleado).subscribe((result) => {
          this.componentService.alerta("success", "Se ha asignado el ticket al colaborador").then((result) => {
            if (result.isConfirmed) {
              this.ngOnInit();
              this.dialogRef.close();
            }
          });
        }, (error: HttpError) => {
          if (error.statusCode == 500) {
            this.componentService.alerta("error", "Ocurrió un problema al asignar el ticket");
          }
        })
      }
    })
  }
}
