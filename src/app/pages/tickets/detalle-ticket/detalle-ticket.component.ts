import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

//Iconos
import icDescription from "@iconify/icons-ic/twotone-description";
import icTicket from "@iconify/icons-ic/local-play";
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

//Animaciones
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { TicketsService } from "../tickets.service";
import { Tareas, TicketInterno } from "src/app/model/models";
import { DataService } from "../../../services/data.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";
import { LocalService } from "src/app/services/local.service";

@Component({
  selector: "vex-detalle-ticket",
  templateUrl: "./detalle-ticket.component.html",
  styleUrls: ["./detalle-ticket.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class DetalleTicketComponent implements OnInit {
  // PARAMETROS RECIBIDOS
  idTicket: any;

  // Iconos
  icTicket = icTicket;
  icSearch = icSearch;
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

  // VARIABLES
  dataTicket: TicketInterno;
  dataTarea: Tareas;
  dataTicketPadre: TicketInterno;
  dataTareaPadre: Tareas;
  empleados = [];
  departamento;
  tipoTarea;
  tags = [];
  encargados = [];
  adjuntos: any[] = [];
  comentarios: any[] = [];
  idFuncionario;
  statusColor;
  statusChildColor;

  //Banderas
  flagEditar = false;
  nuevoTicket = false;
  flagEditarTicket = false;
  flagTicketEditado = false;
  flagTicketAsignado = false;
  flagTicketAdjunto = false;
  flagDocumento = false;
  flagComentario = false;
  subTareas: any[] = [];
  actividades: any[] = [];

  estados = [];
  fechaTentativa = "";
  asignado = false;
  date = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private ticketsService: TicketsService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private component: ComponentesService,
    private router: Router,
    private localServiceS: LocalService
  ) {}

  cargarEstados(estado) {
    this.ticketsService.getEstadosDetalle(estado).subscribe(
      (res) => {
        this.estados = res;
      },
      (error) => {
        this.component.errorHandler(error);
        this.flagEditarTicket = false;
      }
    );
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  cambiarEstado(event) {
    this.estados = [];
    this.cargarEstados(this.dataTicket.estado);
    this.flagEditarTicket = event;
  }

  ticketEditado(event) {
    this.flagTicketEditado = event;
    if (this.flagTicketEditado) {
      this.ngOnInit();
    }
  }

  ticketAsignado(event) {
    this.flagTicketAsignado = event;
    if (this.flagTicketAsignado) {
      this.ngOnInit();
    }
  }

  ticketAdjunto(event) {
    this.flagTicketAdjunto = event;
    if (this.flagTicketAdjunto) {
      this.ngOnInit();
    }
  }

  getDocumento(event) {
    this.flagDocumento = event;
    if (this.flagDocumento) {
      this.ngOnInit();
    }
  }

  getComentario(event) {
    this.flagComentario = event;
    if (this.flagComentario) {
      this.ngOnInit();
    }
  }

  seleccionarEstado(estado) {
    this.component
      .alertaButtons(
        "Estás seguro de cambiar de estado",
        "Cambiar de estado",
        "info"
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.spinner.show();
          const id = this.localServiceS.getItem("id");
          const data = {
            estado:
              estado == "Atendido"
                ? (estado = "Completado")
                : (estado = estado),
            idEntidad: id,
          };
          this.ticketsService.putEstadoTicket(this.idTicket, data).subscribe(
            (res) => {
              this.spinner.hide();
              this.component.alerta(
                "success",
                "Se ha actualizado el estado del ticket"
              );
              this.flagEditarTicket = false;
              this.ngOnInit();
            },
            (error) => {
              this.spinner.hide();
              this.component.alerta("error", error.error.message);
            }
          );
        }
      });
  }

  items = [];
  home;

  ngOnInit() {
    this.cargarRuta();
    this.home = { icon: "pi pi-ticket", routerLink: "/tickets/misTickets" };
  }

  verSubTarea(idSubTarea) {
    if (this.dataTicket.idTicketPadre >= 0) {
      this.router.navigateByUrl(`/tickets/detalle-ticket/${idSubTarea}`);
    } else {
    }

    //location.href = `http://localhost:4200/tickets/detalle-ticket/${idSubTarea}`;
  }

  cargarRuta() {
    // subscribe to the parameters observable
    this.route.paramMap.subscribe((params) => {
      this.idTicket = params.get("id");
      this.cargarDatosTicket();
    });
  }

  cargarDatosTicket() {
    this.ticketsService
      .getTicketById(this.idTicket)
      .subscribe((ticket: TicketInterno) => {
        this.dataTicket = ticket["result"];
        this.departamento = ticket["result"].area;
        this.tipoTarea = this.dataTicket.tipoTarea;
        if (this.dataTicket.estado == "Atendido") {
          this.dataTicket.estado = "Completado";
        }
        this.statusColor = this.ticketsService.setStatusColor(
          this.dataTicket.estado
        );
        if (this.dataTicket.estadoHijo != "Ninguno") {
          this.statusChildColor = this.ticketsService.setStatusColor(
            this.dataTicket.estadoHijo
          );
        }
        this.date = new FormControl(this.dataTicket.fechaTentativa);
        this.cargarEncargados();

        if (this.dataTicket.idTicketPadre) {
          this.ticketsService
            .getTicketById(this.dataTicket.idTicketPadre)
            .subscribe((ticket: TicketInterno) => {
              this.dataTicketPadre = ticket["result"];
            });
        }

        /*    this.data.getTiposTareasByArea(this.dataTicket.idDepartamento).subscribe((tiposTareas: any) => {
        const data = tiposTareas["result"].filter(tarea => tarea.idTipoTarea == this.dataTicket.idTipoTarea)
        this.tipoTarea = data[0];
      })
 */
        this.data
          .getTagsByTipoTarea(this.dataTicket.idTipoTarea)
          .subscribe((tags: any) => {
            this.tags = tags["result"];
          });

        /* this.data.getEmpleadosByArea(this.dataTicket.idArea).subscribe(empleado => {
        this.empleados = empleado["result"];
      }); */

        this.ticketsService
          .getTareaById(this.dataTicket.idTarea)
          .subscribe((tarea: any) => {
            this.dataTarea = tarea["result"];
            if (this.dataTarea.asignadoA) {
              this.asignado = true;
            } else {
              this.asignado = false;
            }
          });
        this.cargarSubTareas(this.dataTicket.idTicket);
        this.cargarComentarios(this.dataTicket.idTarea);
      });
  }

  cargarEncargados() {
    this.idFuncionario = this.localServiceS.getItem("id");
    this.data.getEncargados().subscribe((res) => {
      this.encargados = res["result"];
      //El funcionario es el creador del Ticket
      if (this.dataTicket.idEntidad == this.idFuncionario) {
        this.flagEditar = true;
      } else {
        //El funcionario es un ENCARGADO?
        const data = this.encargados.filter(
          (encargado) => encargado.idEntidad == this.idFuncionario
        );
        if (data.length > 0) {
          //El funcionario es un ENCARGADO
          this.flagEditar = true;
        } else {
          //El funcionario NO es un ENCARGADO
          this.flagEditar = false;
        }
      }
    });
  }

  postFechaTentativa() {
    // this.ticketsService
  }

  addEvent(a, event) {
    this.fechaTentativa = formatDate(event.value, "yyyy-MM-dd", "en-US");
    const data = {
      fechaTentativa: this.fechaTentativa,
    };
    this.ticketsService
      .postFechaTentativa(this.dataTicket.idTicket, data)
      .subscribe((res) => {});
  }

  cargarComentarios(idTarea) {
    this.ticketsService.getComentariosByIdTarea(idTarea).subscribe(
      (res: any) => {
        this.actividades = res.result;
      },
      (error) => {}
    );
  }

  cargarSubTareas(idTicket) {
    this.ticketsService
      .getTicketSubTarea(idTicket)
      .subscribe((tickets: any) => {
        this.subTareas = tickets["result"];
        // if (this.subTareas.length > 0) {
        //   this.items = [
        //     {label: this.dataTicket.asunto},
        //   ];
        // } else {
        // console.log("No hay sub tareas", this.dataTicketPadre);
        // this.items = [
        //   {label: this.dataTicketPadre.asunto},
        //   {label: this.dataTicket.asunto},
        // ];
        // }
        // console.log(this.items);
      });
  }

  itemClicked(event) {
    if (event.item.label == this.dataTicketPadre.asunto) {
      this.router.navigateByUrl(
        `/tickets/detalle-ticket/${this.dataTicketPadre.idTicket}`
      );
    } else {
    }
  }

}
