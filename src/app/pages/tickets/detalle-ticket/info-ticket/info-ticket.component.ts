//Iconos
import icDescription from "@iconify/icons-ic/twotone-description";
import icSearch from "@iconify/icons-ic/twotone-search";
import icEmail from "@iconify/icons-ic/email";
import icAssignment from "@iconify/icons-ic/assignment-ind";
import icPhone from "@iconify/icons-ic/phone";
import icLocationCity from "@iconify/icons-ic/location-city";
import icPerson from "@iconify/icons-ic/person";
import icCreditCard from "@iconify/icons-ic/credit-card";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFavorite from "@iconify/icons-ic/twotone-favorite";
import icComment from "@iconify/icons-ic/twotone-comment";
import icAttachFile from "@iconify/icons-ic/twotone-attach-file";
import icKeyboardArrowRight from "@iconify/icons-ic/twotone-keyboard-arrow-right";
import icCheck from "@iconify/icons-ic/sharp-check";
import icCross from "@iconify/icons-ic/highlight-off";
import icTicket from "@iconify/icons-ic/local-play";
import icEdit from "@iconify/icons-ic/edit";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import icInsertDriveFile from "@iconify/icons-ic/insert-drive-file";
import icArrowDown from "@iconify/icons-ic/keyboard-arrow-down";

//Animaciones
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ErrorHandler,
  OnChanges,
  AfterViewChecked,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "../../../../services/data.service";
import { TicketInterno, Tareas, PostAdjunto } from "../../../../model/models";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "../../../../services/componentes.service";
import { MatDialog } from "@angular/material/dialog";
import { AsignarMiembroComponent } from "./asignar-miembro/asignar-miembro.component";
import { TicketsService } from "../../tickets.service";
import { ComentarTicketComponent } from "../comentar-ticket/comentar-ticket.component";
import { ToolbarCrearTicketComponent } from "../../../../../@vex/layout/toolbar/toolbar-crear-ticket/toolbar-crear-ticket.component";
import { HttpErrorResponse } from "@angular/common/http";
import { EditarTicketComponent } from "../../editar-ticket/editar-ticket.component";
import { PrimeIcons } from "primeng/api";
import { CrearTicketComponent } from "../../crear-ticket/crear-ticket.component";
import Swal from "sweetalert2";
import { C } from "@angular/cdk/keycodes";
import { LocalService } from "src/app/services/local.service";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-info-ticket",
  templateUrl: "./info-ticket.component.html",
  styleUrls: ["./info-ticket.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class InfoTicketComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  //Iconos
  icSearch = icSearch;
  icEdit = icEdit;
  icDescription = icDescription;
  icEmail = icEmail;
  icPhone = icPhone;
  icAssignment = icAssignment;
  icLocationCity = icLocationCity;
  icPerson = icPerson;
  icCreditCard = icCreditCard;
  icAdd = icAdd;
  icFavorite = icFavorite;
  icComment = icComment;
  icAttachFile = icAttachFile;
  icKeyboardArrowRight = icKeyboardArrowRight;
  icCheck = icCheck;
  icCross = icCross;
  icTicket = icTicket;
  icPdf = icPdf;
  icInsertDriveFile = icInsertDriveFile;
  icArrowDown = icArrowDown;

  //Variables
  @Input() dataTicket?: TicketInterno;
  @Input() dataTarea?: Tareas;
  @Input() subTareas?: any[] = [];
  adjuntos: any[] = [];
  @Input() comentarios?: any[] = [];
  documento;
  observaciones;
  ocultarGarantizadosLoad = false;
  ocultarGarantesLoad = false;
  empleados = [];
  encargados: any[];
  idFuncionario;

  //Banderas
  flagEditar = false;
  flagAsignar = false;
  @Output() emitirTicket = new EventEmitter<boolean>();
  @Output() emitirTicketEditado = new EventEmitter<boolean>();
  @Output() emitirTicketAsignado = new EventEmitter<boolean>();
  @Output() emitirTicketAdjunto = new EventEmitter<boolean>();
  @Output() emitirDocumento = new EventEmitter<boolean>();
  @Output() emitirComentario = new EventEmitter<boolean>();

  nombreArchivo: string;
  tamanioArchivo: string;
  fileBase64: string;
  adjunto: boolean;
  mostrarAdjuntos = false;

  constructor(
    private router: Router,
    private data: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private componentes: ComponentesService,
    public dialog: MatDialog,
    private ticketService: TicketsService,
    private dataService: DataService,
    private localServiceS: LocalService,
    private ticketsService: TicketsService,
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit() {
    this.cargarMiembros();
    this.cargarEncargados();
    this.idFuncionario = this.localServiceS.getItem("id");
    this.cargarAdjuntos(this.dataTicket.idTicket)
  }

  cargarMiembros() {
    //TODO: VALIDO SI ES CESANTIA PARA ASIGNACIÓN DE DIFERENTES MIEMBROS
    if (!this.dataTicket.esCesantia) {
      this.data
        .getEmpleadosByArea(this.dataTicket.idArea)
        .subscribe((empleado) => {
          this.empleados = empleado["result"];
        });
    } else {
      this.data.getEmpleadosCesantia().subscribe((empleados) => {
        this.empleados = empleados;
      });
    }
  }

  ngOnChanges(changes) {
    if (changes.dataTicket != undefined) {
      if (changes.dataTicket.currentValue.idTicket) {
        this.dataTicket.idTicket = changes.dataTicket.currentValue.idTicket;
        this.dataTicket.idDepartamento =
          changes.dataTicket.currentValue.idDepartamento;
        this.ngOnInit();
      }
    }
  }

  aprobarTicket(aprobado) {
    var alertTitle = "";
    var mensaje = "";
    if (aprobado) {
      alertTitle = "¿Desea aprobar esta solicitud?";
      mensaje = "APROBADO<br>";
    } else {
      alertTitle = "¿Desea rechazar esta solicitud?";
      mensaje = "RECHAZADO<br>";
    }
    Swal.fire({
      title: alertTitle,
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#169116",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        const data = {
          observaciones: mensaje + texto,
          aprobado: aprobado,
        };
        if (data.observaciones == "") {
          this.componentes.alerta(
            "info",
            "Debe ingresar un comentario para continuar"
          );
        } else {
          this.ticketService
            .postAprobarTicket(
              this.dataTicket.idTicket,
              this.dataTicket.idEntidad,
              data
            )
            .subscribe(
              (res) => {
                if (aprobado) {
                  this.componentes.alerta(
                    "success",
                    "Se ha aprobado el ticket"
                  );
                  this.emitirTicketEditado.emit(true);
                } else {
                  this.componentes.alerta(
                    "success",
                    "El ticket ha sido rechazado"
                  );
                  this.emitirTicketEditado.emit(true);
                }
              },
              (error) => {
                this.componentes.alerta("error", error.error.message);
              }
            );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  openModal(): void {
    if (this.dataTicket.requiereAprobacion) {
      if (this.dataTicket.fechaAprobacion != null) {
        const dialogRef = this.dialog.open(AsignarMiembroComponent, {
          // width: '400px',
          maxWidth: "100%",
          panelClass: "full-with-dialog",
          data: this.empleados,
        });

        dialogRef.afterClosed().subscribe((colaborador) => {
          if (colaborador) {
            this.ticketService
              .postAsignarFuncionario(
                this.dataTicket["idTicket"],
                colaborador["idEmpleado"]
              )
              .subscribe(
                (res: any) => {
                  this.componentes.alerta("success", "Asignado correctamente");
                  this.emitirTicketAsignado.emit(true);
                },
                (error) => {
                  this.componentes.alerta(
                    "error",
                    "Ocurrió un error al asignar el miembro"
                  );
                }
              );
          }
        });
      } else {
        this.componentes.alerta(
          "info",
          "El Ticket debe ser aprobado antes de realizar acciones"
        );
      }
    } else {
      const dialogRef = this.dialog.open(AsignarMiembroComponent, {
        // width: '400px',
        maxWidth: "100%",
        panelClass: "full-with-dialog",
        data: this.empleados,
      });

      dialogRef.afterClosed().subscribe((colaborador) => {
        if (colaborador) {
          this.ticketService
            .postAsignarFuncionario(
              this.dataTicket["idTicket"],
              colaborador["idEmpleado"]
            )
            .subscribe(
              (res: any) => {
                this.componentes.alerta("success", "Asignado correctamente");
                this.emitirTicketAsignado.emit(true);
              },
              (error) => {
                this.componentes.errorHandler(error);
              }
            );
        }
      });
    }
  }

  cargarEncargados() {
    this.data.getEncargados().subscribe((res) => {
      this.encargados = res["result"];
      //El funcionario es el creador del Ticket
      if (this.dataTicket.idEntidad == this.idFuncionario) {
        this.flagEditar = true;
        this.flagAsignar = false;
        const data = this.encargados.filter(
          (encargado) => encargado.idEntidad == this.idFuncionario
        );
        if (data.length > 0) {
          //El funcionario es un ENCARGADO
          this.flagAsignar = true;
          this.flagEditar = true;
        } else {
          //El funcionario NO es un ENCARGADO
          if (
            this.dataTicket.idTicketPadre != null ||
            this.dataTicket.idTicketPadre != 0
          ) {
            this.flagAsignar = true;
          } else {
            this.flagAsignar = false;
          }
          this.flagEditar = false;
        }
      } else {
        //El funcionario es un ENCARGADO?
        const data = this.encargados.filter(
          (encargado) => encargado.idEntidad == this.idFuncionario
        );
        if (data.length > 0) {
          //El funcionario es un ENCARGADO
          this.flagEditar = true;
          this.flagAsignar = true;
        } else {
          //El funcionario NO es un ENCARGADO
          if (
            this.dataTicket.idTicketPadre != null ||
            this.dataTicket.idTicketPadre != 0
          ) {
            this.flagAsignar = true;
          } else {
            this.flagAsignar = false;
          }
          this.flagEditar = false;
        }
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.nombreArchivo = event.target.files[0].name;
    this.tamanioArchivo = event.target.files[0].size;
    const base64 = event.target.files.item(0);
    this.dataService.getBase64(base64).then((res: any) => {
      this.fileBase64 = res;
      this.adjunto = true;
      this.mostrarAdjuntos = true;
      const adjuntoEnviar: PostAdjunto = {
        adjunto: this.fileBase64,
        name: this.nombreArchivo,
        mimeType: file.type,
        idTicket: this.dataTicket.idTicket,
        tipoAdjunto: TiposAdjunto.Documento,
        observaciones: this.nombreArchivo,
      };
      this.ticketService
        .postNewTicketAdjunto(adjuntoEnviar)
        .subscribe((res: any) => {
          this.emitirTicketAdjunto.emit(true);
        });
    });
  }

  getDocumento(event) {
    this.emitirDocumento.emit(event);
  }

  getComentario(event) {
    this.emitirComentario.emit(event);
  }

  cambiarEstado() {
    if (this.dataTicket.requiereAprobacion) {
      if (this.dataTicket.fechaAprobacion != null) {
        const ticket = true;
        this.emitirTicket.emit(ticket);
      } else {
        this.componentes.alerta(
          "info",
          "El Ticket debe ser aprobado antes de realizar acciones"
        );
      }
    } else {
      const ticket = true;
      this.emitirTicket.emit(ticket);
    }
  }

  editarTicket() {
    if (this.dataTicket.requiereAprobacion) {
      if (this.dataTicket.fechaAprobacion != null) {
        this.modalSubTarea(false);
      } else {
        this.componentes.alerta(
          "info",
          "El Ticket debe ser aprobado antes de realizar acciones"
        );
      }
    } else {
      this.modalSubTarea(false);
    }
  }

  irParticipe(idParticipe) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/participes/consolidada/${idParticipe}`])
    );
    window.open(url, "_blank");
  }

  detalleParticipe(identificacion) {
    // Converts the route into a string that can be used
    // with the window.open() function
    this.localServiceS.setItem("identificacion", identificacion);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/participes/consolidada`])
    );
    window.open(url, "_blank");
  }

  verSubTarea(idSubTarea) {
    this.router.navigateByUrl(`/tickets/detalle-ticket/${idSubTarea}`);
    //location.href = `http://localhost:4200/tickets/detalle-ticket/${idSubTarea}`;
  }

  crearSubTarea() {
    if (this.dataTicket.requiereAprobacion) {
      if (this.dataTicket.fechaAprobacion != null) {
        this.modalSubTarea(true);
      } else {
        this.componentes.alerta(
          "info",
          "El Ticket debe ser aprobado antes de realizar acciones"
        );
      }
    } else {
      this.modalSubTarea(true);
    }
  }

  modalSubTarea(subTarea: boolean) {
    const dialogRef = this.dialog.open(CrearTicketComponent, {
      data: {
        dataTicket: this.dataTicket,
        datatarea: this.dataTarea,
        subTarea: subTarea,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.spinner.hide();
    });
  }

  comentar() {
    const dialogRef = this.dialog.open(ComentarTicketComponent, {
      width: "600px",
      height: "fit-content",
      data: {
        dataTicket: this.dataTicket,
        dataTarea: this.dataTarea,
      },
    });
    const id = this.localServiceS.getItem("id");
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.dataTicket.estado != "Completado") {
        const data = {
          estado: "EsperaRespuesta",
          idEntidad: id,
        };
        this.ticketService
          .putEstadoTicket(this.dataTicket.idTicket, data)
          .subscribe(
            (res) => {
              this.emitirComentario.emit(true);
            },
            (error) => {
              this.componentes.errorHandler(error);
            }
          );
        this.spinner.hide();
      } else {
        this.emitirComentario.emit(true);
      }
    });
  }

  cerrarTicket() {
    Swal.fire({
      icon: "warning",
      title: "¿Desea cerrar este ticket?",
      text: "Al cerrar el ticket, indica que su requerimiento ha sido cumplido.",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      cancelButtonColor: "red",
    }).then((res) => {
      if (res.isConfirmed) {
        const data = {
          estado: "Cerrado",
        };
        this.ticketService
          .putEstadoTicket(this.dataTicket.idTicket, data)
          .subscribe(
            (res) => {
              this.componentes.alerta(
                "success",
                "Ticket cerrado correctamente"
              );
              this.emitirDocumento.emit(true);
            },
            (error) => {
              this.componentes.errorHandler(error);
            }
          );
      }
    });
  }

  cargarAdjuntos(idTicket) {
    this.spinner.show();
    this.adjuntos=[]
    this.ticketsService
      .getNewTicketAdjuntos(idTicket)
      .subscribe((adjuntos: any) => {
        if (adjuntos["result"].length > 0) {
          this.adjuntos = adjuntos["result"];
        }
        this.spinner.hide();
      });
  }
}
