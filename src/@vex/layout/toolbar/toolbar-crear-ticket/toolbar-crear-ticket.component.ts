import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "src/app/pages/auth/auth.service";
import { TicketsService } from "src/app/pages/tickets/tickets.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "../../../../app/services/data.service";
import icDocument from "@iconify/icons-ic/attach-file";
import icRemoveCircle from "@iconify/icons-ic/remove-circle";
import icClose from "@iconify/icons-ic/twotone-close";
import icPictureAsPdf from "@iconify/icons-ic/twotone-picture-as-pdf";
import { PostAdjunto, TicketInterno } from "src/app/model/models";
import { Router } from "@angular/router";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { Areas, TipoTarea } from "src/app/pages/tickets/ticket.interface";
import { MatSelect } from "@angular/material/select";
import Swal from "sweetalert2";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-toolbar-crear-ticket",
  templateUrl: "./toolbar-crear-ticket.component.html",
  styleUrls: ["./toolbar-crear-ticket.component.scss"],
})
export class ToolbarCrearTicketComponent implements OnInit, AfterViewChecked {
  datosTicket: FormGroup;
  area: Areas;
  funcionario;
  clickCrear = false;
  adjunto;
  nombreArchivo: string;
  tamanioArchivo: string;
  fileBase64: string;
  mostrarAdjuntos = false;
  existeSubTarea = false;
  participe = false;
  nombreParticipe;

  //Variables
  tiposTareas: TipoTarea[] = [];
  tags = [];
  tagsSeleccionados = [];
  tagsId = [];
  adjuntos: PostAdjunto[] = [];
  aprobadores = [];

  //Iconos
  icDocument = icDocument;
  icRemoveCircle = icRemoveCircle;
  icClose = icClose;
  icPictureAsPdf = icPictureAsPdf;
  list: any[];
  mensajes: any[] = [];
  idDepartamento: number;
  idTipoTarea;
  idGerente;
  checkBox = false;
  checkBoxAprobacion = false;
  descripcionDepartamento: string;
  protected _onDestroy = new Subject<void>();
  public tipoTareaFilterCtrl: FormControl = new FormControl();
  @ViewChild("singleSelect") singleSelect: MatSelect;
  public filteredTipoTarea: ReplaySubject<TipoTarea[]> = new ReplaySubject<
    TipoTarea[]
  >(1);

  constructor(
    private dataServices: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private authService: AuthService,
    private componentService: ComponentesService,
    private dialogRef: MatDialogRef<ToolbarCrearTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit() {
    if (this.data.subTarea == true) {
      this.existeSubTarea = true;
    } else {
      this.existeSubTarea = false;
    }

    this.dataServices.tokenvalido();
    this.funcionario = this.authService.getFuncionario();

    this.datosTicket = this.fb.group({
      identificacion: ["00"],
      nombre: [""],
      area: ["", [Validators.required]],
      idTipoTarea: [0, [Validators.required]],
      asunto: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
      prioridad: ["", [Validators.required]],
      tags: [[]],
    });

    this.datosTicket.value.nombre = this.funcionario;
    if (!this.data.subTarea) {
      this.cargarTipoTareas();
    } else {
      this.cargarSubtareas(this.data.dataTicket.idTipoTarea);
    }
    this.changeDetectorRefs.detectChanges();
  }

  cargarTipoTareas() {
    this.ticketService.getTiposTarea().subscribe(
      (res: TipoTarea[]) => {
        this.tiposTareas = res;
        this.filteredTipoTarea.next(this.tiposTareas.slice());
        // listen for search field value changes
        this.tipoTareaFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterTipoTarea();
          });
      },
      (error) => {}
    );
  }

  cargarSubtareas(idTipoTarea) {
    this.ticketService.getSubTareas(idTipoTarea).subscribe(
      (res: TipoTarea[]) => {
        this.tiposTareas = res;
        this.filteredTipoTarea.next(this.tiposTareas.slice());
        // listen for search field value changes
        this.tipoTareaFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterTipoTarea();
          });
      },
      (error) => {}
    );
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredTipoTarea
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: TipoTarea, b: TipoTarea) =>
          a && b && a.idTipoTarea === b.idTipoTarea;
      });
  }

  protected filterTipoTarea() {
    if (!this.tiposTareas) {
      return;
    }
    // get the search keyword
    let search = this.tipoTareaFilterCtrl.value;
    if (!search) {
      this.filteredTipoTarea.next(this.tiposTareas.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the emisor
    const data = this.tiposTareas.filter(
      (tipoTarea) => tipoTarea.descripcion.toLowerCase().indexOf(search) > -1
    );
    this.filteredTipoTarea.next(
      this.tiposTareas.filter(
        (tipoTarea) => tipoTarea.descripcion.toLowerCase().indexOf(search) > -1
      )
    );
  }

  cargarAreaByIdTipoTarea(idTipoTarea) {
    this.ticketService.getAreaByIdTiposTarea(idTipoTarea).subscribe(
      (area: Areas) => {
        this.area = area;
        this.idDepartamento = this.area.idDepartamento;
        this.descripcionDepartamento = this.area.descripcion;
      },
      (error) => {}
    );
  }

  seleccionarArea(event) {
    this.tagsSeleccionados = [];
    this.tagsId = [];
    this.tags = [];
    this.changeDetectorRefs.detectChanges();
    this.datosTicket.value.idArea = event;
    this.obtenerTaresByArea(event);
  }

  seleccionarTarea(idTipoTarea) {
    this.idTipoTarea = idTipoTarea;
    this.tagsSeleccionados = [];
    this.tagsId = [];
    this.dataServices.getTagsByTipoTarea(idTipoTarea).subscribe((tags: any) => {
      this.tags = tags["result"];
    });
    this.cargarAreaByIdTipoTarea(idTipoTarea);
    this.cargarMensajes(idTipoTarea);
  }

  cargarMensajes(idTipoTarea) {
    this.ticketService
      .getMensajesByIdTipoTarea(idTipoTarea)
      .subscribe((res: any) => {
        this.mensajes = res.result;
      });
  }

  seleccionarTags(tipoTag) {
    if (this.tagsSeleccionados.length != 0) {
      var existeEtiqueta = this.tagsSeleccionados.find(
        (res) => res["idTag"] == tipoTag["idTag"]
      );
      if (!existeEtiqueta) {
        this.tagsId.push(tipoTag["idTag"]);
        this.tagsSeleccionados.push(tipoTag);
      }
    } else {
      this.tagsId.push(tipoTag["idTag"]);
      this.tagsSeleccionados.push(tipoTag);
    }
  }

  eliminarTag(tag) {
    const index = this.tagsId.findIndex((id) => id == tag.idTag);
    this.tagsId.splice(index, 1);
    this.tagsSeleccionados.splice(index, 1);
  }

  obtenerTaresByArea(idArea) {
    this.dataServices.getTiposTareasByArea(idArea).subscribe((tarea) => {
      this.tiposTareas = tarea["result"];
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.nombreArchivo = event.target.files[0].name;
    this.tamanioArchivo = event.target.files[0].size;
    const base64 = event.target.files.item(0);
    this.dataServices.getBase64(base64).then((res: any) => {
      this.fileBase64 = res;
      this.adjunto = true;
      this.mostrarAdjuntos = true;

      const data: PostAdjunto = {
        tipoAdjunto: TiposAdjunto.Documento,
        adjunto: this.fileBase64,
        mimeType: file.type,
        size: file.size,
        name: file.name,
        observaciones: file.name,
      };

      this.adjuntos.push(data);
    });
  }

  removeAdjunto(index) {
    this.adjuntos.splice(index, 1);
  }

  crearSubTarea() {
    const data = {
      codigo: this.data.dataTicket.codigo,
      identificacion: "",
      nombre: "",
      idDepartamento: this.idDepartamento,
      idTipoTarea: this.idTipoTarea,
      asunto: this.datosTicket.value.asunto,
      descripcion: this.datosTicket.value.descripcion,
      prioridad: this.datosTicket.value.prioridad,
      tags: this.tagsId,
      requiereAprobacion: this.checkBoxAprobacion,
    };

    this.ticketService
      .postTicketCrearSubTarea(this.data.dataTicket.idTicket, data)
      .subscribe((res) => {
        if (this.adjuntos.length > 0) {
          this.adjuntos.forEach((adjunto) => {
            //añadir a adjunto idTicket
            adjunto.idTicket = res["result"].idTicket;
            this.ticketService
              .postNewTicketAdjunto(adjunto)
              .subscribe((res: any) => {});
          });
          this.alertaTicketCreado(res["result"].idTicket);
        } else {
          this.alertaTicketCreado(res["result"].idTicket);
        }
      });
  }

  setearMensaje(mensaje) {
    this.datosTicket.patchValue({
      asunto: mensaje.asunto,
      descripcion: mensaje.descripcion,
    });
  }

  alertaTicketCreado(idTicket) {
    this.clickCrear = false;
    this.spinner.hide();
    this.componentService
      .alerta("success", "Ticket creado con éxito")
      .then(() => {
        this.dialogRef.close();
        this.router.navigate([`/tickets/detalle-ticket/${idTicket}`]);
      });
  }

  generarTicket() {
    const data = {
      identificacion: this.datosTicket.value.identificacion,
      nombre: "",
      idDepartamento: this.idDepartamento,
      idTipoTarea: this.idTipoTarea,
      asunto: this.datosTicket.value.asunto,
      descripcion: this.datosTicket.value.descripcion,
      prioridad: this.datosTicket.value.prioridad,
      tags: this.tagsId,
      requiereAprobacion: this.checkBoxAprobacion,
      idGerente: this.idGerente,
    };
    this.datosTicket.value.tags = this.tagsId;
    this.datosTicket.value.identificacion = "00";
    if (this.checkBox) {
      if (this.participe) {
        this.postTicket(data);
      } else {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Debe ingresar una cedula valida"
        );
      }
    } else {
      if (this.checkBoxAprobacion) {
        if (this.idGerente != undefined) {
          this.postTicket(data);
        } else {
          this.componentService.alerta(
            "error",
            "Debe seleccionar de quien requiere la aprobación!"
          );
        }
      } else {
        this.postTicket(data);
      }
    }
  }

  postTicket(data) {
    if (this.datosTicket.valid) {
      this.clickCrear = true;
      this.spinner.show();
      this.ticketService.postTicketCreateInterno(data).subscribe(
        (res: any) => {
          if (this.adjuntos.length > 0) {
            this.adjuntos.forEach((adjunto) => {
              //añadir a adjunto idTicket
              adjunto.idTicket = res["result"].idTicket;
              this.ticketService
                .postNewTicketAdjunto(adjunto)
                .subscribe((res: any) => {});

              this.alertaTicketCreado(res["result"].idTicket);
            });
          } else {
            this.alertaTicketCreado(res["result"].idTicket);
          }
        },
        (response) => {
          this.spinner.hide();
          this.componentService.alerta("error", response.error.message);
        }
      );
    } else {
      this.clickCrear = false;
      this.componentService.alerta("error", "Debe completar todos los campos");
    }
  }

  datosParticipe(value) {
    this.checkBox = value;
  }

  checkAprobacion(value) {
    this.checkBoxAprobacion = value;
    if (this.aprobadores.length == 0 && this.checkBoxAprobacion) {
      this.dataServices.getGerentes().subscribe((res) => {
        this.aprobadores = res["result"];
      });
    }
  }

  change(event) {
    if (event) {
      if (event.length == 10) {
        this.spinner.show();
        this.nombreParticipe = undefined;
        this.dataServices.getParticipeByIdentificacion(event).subscribe(
          (res) => {
            this.participe = true;
            this.nombreParticipe = res["result"].razonSocial;
            this.spinner.hide();
          },
          async (error) => {
            this.participe = false;
            this.spinner.hide();
            await Swal.fire({
              icon: "warning",
              text: "Participe no existe!",
            });
          }
        );
      }
    }
  }

  seleccionarAprobador(value) {
    this.idGerente = value;
  }
}
