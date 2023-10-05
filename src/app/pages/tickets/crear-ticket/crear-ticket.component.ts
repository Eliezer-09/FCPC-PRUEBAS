import { COMMA, ENTER, I } from "@angular/cdk/keycodes";
import { dropdownAnimation } from "src/@vex/animations/dropdown.animation";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  TemplateRef,
  Inject,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from "ngx-spinner";
import { QuickpanelComponent } from "src/@vex/layout/quickpanel/quickpanel.component";
import { TourServices } from "src/app/services/tour.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";

//Iconos
import icClose from "@iconify/icons-ic/twotone-close";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSend from "@iconify/icons-ic/twotone-send";
import icAttachFile from "@iconify/icons-ic/twotone-attach-file";
import icPictureAsPdf from "@iconify/icons-ic/insert-drive-file";
import icImage from "@iconify/icons-ic/twotone-image";
import icHelp from "@iconify/icons-ic/help";
import { TicketsService } from "../tickets.service";
import { Areas, TipoTarea } from "../ticket.interface";
import { DataService } from "src/app/services/data.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { Router } from "@angular/router";
import { MatCheckboxChange } from "@angular/material/checkbox";
import Swal from "sweetalert2";
import { takeUntil, take } from "rxjs/operators";
import { MatSelect } from "@angular/material/select";
import { LocalService } from "src/app/services/local.service";
import { PostAdjunto } from "src/app/model/models";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-crear-ticket",
  templateUrl: "./crear-ticket.component.html",
  styleUrls: [
    // '../../../../../../../node_modules/quill/dist/quill.snow.css',
    "./crear-ticket.component.scss",
  ],
  animations: [
    dropdownAnimation,
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
  providers: [QuickpanelComponent],
  encapsulation: ViewEncapsulation.None,
})
export class CrearTicketComponent implements OnInit {
  @ViewChild("contentSuccess")
  private contentSuccess: TemplateRef<any>;
  desabilitarboton = false;
  titulo: string = "";
  //iconos
  icClose = icClose;
  icDelete = icDelete;
  icSend = icSend;
  icAttachFile = icAttachFile;
  icPictureAsPdf = icPictureAsPdf;
  icImage = icImage;
  icHelp = icHelp;

  dropdownOpen = false;
  //VARIABLES DE TICKETS
  tabs = ["Ticket"];
  selected = new FormControl(0);
  tags: any[] = [];
  idtags: any[] = [];
  doc;
  size;
  nombreArchivo: string;
  nombreParticipe: string;
  borrador: any[] = [];
  archivoUrl;
  idEntidad;
  btnName;
  textoSuccess = "Ticket creado con éxito";
  fechaHoy: string = new Date().toISOString().split("T")[0];
  tipoTarea = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  alltags: any[] = [];
  displayModal = false;
  participe = false;
  checked: boolean;

  //formulario ticket
  ticketForm = this.fb.group({
    idTipoTarea: [""],
    departamento: [""],
    idDepartamento: [""],
    idArea: [""],
    prioridad: ["", Validators.required],
    tags: [this.idtags],
    asunto: [""],
    descripcion: [""],
    idTicketEstado: [""],
    idSolicitante: [""],
    idAsignado: [""],
    fecha: [""],
    titulo: [""],
    idTicketPadre: [""],
    idAprobadoPor: [""],
    leido: [""],
    checkBoxAprobacion: [false],
    identificacion: [""],
    // adjuntos: this.adjuntos,
  });

  tiposTareas: TipoTarea[] = [];
  tagsSeleccionados = [];
  tagsId: any[] = [];
  mostrarAdjuntos = false;
  fileBase64: string;
  adjunto;
  adjuntos: PostAdjunto[] = [];
  checkBoxParticipe = false;
  detalleTipoTarea = null;
  public filteredTipoTarea: ReplaySubject<TipoTarea[]> = new ReplaySubject<
    TipoTarea[]
  >(1);
  public tipoTareaFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  @ViewChild("singleSelect") singleSelect: MatSelect;

  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    // private apiTicket: TicketsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private localServiceS: LocalService,
    private snackbar: MatSnackBar,
    private ticketService: TicketsService,
    private dialogRef: MatDialogRef<CrearTicketComponent>,
    private dataService: DataService,
    private componentService: ComponentesService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {
    this.idEntidad = this.localServiceS.getItem("entidad");
    this.filtroTag();
    if (this.data != null) {
      if (this.data["subTarea"]) {
        this.btnName = "Crear Subtarea";
        this.ticketService
          .getSubTareas(this.data["dataTicket"].idTipoTarea)
          .subscribe(
            (res: TipoTarea[]) => {
              this.tiposTareas = res;
              this.filteredTipoTarea.next(this.tiposTareas.slice());
            },
            (error) => {}
          );
      } else {
        this.titulo = "Editar Ticket";
        this.btnName = "Editar Ticket";
        this.cargarTipoTareas();
        this.ticketForm.controls["idTipoTarea"].setValue(
          this.data["dataTicket"].idTipoTarea
        );
        this.ticketForm.controls["idDepartamento"].setValue(
          this.data["dataTicket"].idDepartamento
        );
        this.ticketForm.controls["idArea"].setValue(
          this.data["dataTicket"].idArea
        );
        this.cargarAreaByIdTipoTarea(this.data["dataTicket"].idTipoTarea);
        this.ticketForm.controls["prioridad"].setValue(
          this.data["dataTicket"].prioridad
        );
        this.ticketService
          .getTagsByTipoTarea(this.data["dataTicket"].idTipoTarea)
          .subscribe((tags: any) => {
            this.tags = tags["result"];
          });
        this.ticketForm.controls["tags"].setValue(this.data["dataTicket"].tags);
        if (this.data["dataTicket"].identificacion != "") {
          this.ticketForm.controls["identificacion"].setValue(
            this.data["dataTicket"].identificacion
          );
          this.checkBoxParticipe = true;
          this.checked = true;
        }
        this.tagsSeleccionados = this.data["dataTicket"].tags;
        this.ticketForm.controls["asunto"].setValue(
          this.data["dataTicket"].asunto
        );
        this.ticketForm.controls["descripcion"].setValue(
          this.data["dataTicket"].descripcion
        );
      }
    } else {
      this.titulo = "Crear ticket de atención";
      this.btnName = "Crear Ticket";
      this.cargarTipoTareas();
    }
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredTipoTarea
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: TipoTarea, b: TipoTarea) =>
          a && b && a.idTipoTarea === b.idTipoTarea;
      });
  }

  cargarTipoTareas() {
    this.spinner.show();
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
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
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

  checkCedula(event) {
    if (event) {
      if (event.length == 10) {
        this.spinner.show();
        this.dataService.getParticipeByIdentificacion(event).subscribe(
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

  //nuevos tickets
  addTab() {
    this.tabs.push("Nuevo ticket ");
    this.borrador.push(this.ticketForm.value);
    this.selected.setValue(this.tabs.length - 1);
  }
  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  //nuevos tags
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected1(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    const data = {
      idTag: event.option.value.idTag,
    };
    this.idtags.push(data);
    this.tagInput.nativeElement.value = "";
  }

  //subir el pdf
  cargarArchivo(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.nombreArchivo = event.target.files[0].name;
    // this.tamanioArchivo = event.target.files[0].size;
    const base64 = event.target.files.item(0);
    this.dataService.getBase64(base64).then((res: any) => {
      this.fileBase64 = res;
      this.adjunto = true;
      this.mostrarAdjuntos = true;

      const data: PostAdjunto = {
        tipoAdjunto: TiposAdjunto.Documento,
        adjunto: this.fileBase64,
        mimeType: file.type,
        name: file.name,
        observaciones: file.name,
      };

      this.adjuntos.push(data);
    });
  }

  //crear el ticket
  CrearTicket(form: any) {
    const ticket = {
      identificacion: this.ticketForm.value.identificacion,
      idDepartamento: this.ticketForm.value.idDepartamento,
      idArea: this.ticketForm.value.idArea,
      idTipoTarea: this.ticketForm.value.idTipoTarea,
      asunto: this.ticketForm.value.asunto,
      descripcion: this.ticketForm.value.descripcion,
      prioridad: this.ticketForm.value.prioridad,
      tags: this.tagsId,
    };
    this.postTicket(ticket);
    if (this.ticketForm.invalid) {
      this.snackbar.open("Por favor llene todos los campos", "Cerrar", {
        duration: 3000,
        panelClass: ["snackbar-error"],
      });
    }
  }

  postTicket(data) {
    if (this.ticketForm.valid) {
      this.spinner.show();
      if (this.data != null) {
        if (this.data["subTarea"]) {
          // SUBTAREA
          this.ticketService
            .postTicketCrearSubTarea(this.data["dataTicket"].idTicket, data)
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
        } else {
          // EDITAR TICKET
          this.ticketService
            .putTicket(this.data["dataTicket"].idTicket, data)
            .subscribe(
              (res) => {
                this.spinner.hide();
                this.componentService
                  .alerta("success", "Se ha editado el ticket")
                  .then((res) => {
                    if (res.isConfirmed) {
                      this.dialogRef.close();
                    }
                  });
              },
              (error) => {
                this.spinner.hide();
                this.componentService.alerta("Error", error.error.message);
              }
            );
        }
      } else {
        // NUEVO TICKET
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
                this.router.navigate([
                  "/tickets/detalle-ticket/" + res["result"].idTicket,
                ]);
              });
              this.dialogRef.close();
            } else {
              this.alertaTicketCreado(res["result"].idTicket);
              this.router.navigate([
                "/tickets/detalle-ticket/" + res["result"].idTicket,
              ]);
            }
          },
          (response) => {
            this.spinner.hide();
            this.componentService.alerta("error", response.error.message);
          }
        );
      }
    } else {
      // this.clickCrear = false;
      this.componentService.alerta("error", "Debe completar todos los campos");
    }
  }

  alertaTicketCreado(idTicket) {
    this.spinner.hide();
    this.componentService
      .alerta("success", "Ticket creado con éxito")
      .then(() => {
        this.dialogRef.close();
        // this.router.navigate([`/tickets/detalle-ticket/${idTicket}`]);
      });
  }

  datosParticipe(value) {
    this.checkBoxParticipe = value;
  }

  aprobacionCheck(event: MatCheckboxChange) {
    this.ticketForm.controls.checkBoxAprobacion.setValue(event.checked);
  }

  seleccionarTarea(valor, evento) {
    switch (evento) {
      case "tipoTarea":
        this.cargarDetalle(valor);
        this.ticketForm.controls["idTipoTarea"].setValue(valor);
        this.ticketService.getTagsByTipoTarea(valor).subscribe((tags: any) => {
          this.tags = tags["result"];
        });
        this.cargarAreaByIdTipoTarea(valor);
        // this.cargarMensajes(idTipoTarea);
        break;
      case "area":
        break;
      case "tipoTag":
        if (this.tagsSeleccionados.length != 0) {
          this.tagsId.length = 0;
          this.tagsSeleccionados.length = 0;
          var existeEtiqueta = this.tagsSeleccionados.find(
            (res) => res["idTag"] == valor["idTag"]
          );
          if (!existeEtiqueta) {
            this.tagsId.push(valor["idTag"]);
            this.tagsSeleccionados.push(valor);
          }
        } else {
          this.tagsId.push(valor["idTag"]);
          this.tagsSeleccionados.push(valor);
        }
        break;
    }
  }

  cargarDetalle(idTipoTarea) {
    this.detalleTipoTarea = null;
    var dataTipoTarea = this.tiposTareas.find(
      (x) => x.idTipoTarea === idTipoTarea
    );
    if (dataTipoTarea["detalle"] != null) {
      this.detalleTipoTarea = dataTipoTarea["detalle"];
    }
  }

  eliminarTag(tag) {
    const index = this.tagsId.findIndex((id) => id == tag.idTag);
    this.tagsId.splice(index, 1);
    this.tagsSeleccionados.splice(index, 1);
  }

  cargarAreaByIdTipoTarea(idTipoTarea) {
    this.ticketService.getAreaByIdTiposTarea(idTipoTarea).subscribe(
      (area: Areas) => {
        this.ticketForm.controls["departamento"].setValue(area.descripcion);
        this.ticketForm.controls["idDepartamento"].setValue(
          area.idDepartamento.toString()
        );
        this.ticketForm.controls["idArea"].setValue(area.idArea.toString());
      },
      (error) => {}
    );
  }

  filtroTag() {
    this.filteredTags = this.ticketForm.controls["tags"].valueChanges.pipe(
      startWith(""),
      //map((value) => (typeof value === "string" ? value : value?.pais)), lo comente porque no tengo ni idea, AJ 20230926
      map((tag) =>
        tag ? this._filter(tag, this.alltags) : this.alltags.slice()
      )
    );
  }
  private _filter(name: string, arreglo: any[]): any[] {
    const filterValue = name.toLowerCase();
    return arreglo.filter((option) =>
      option.descripcion.toLowerCase().includes(filterValue)
    );
  }

  removeAdjunto(index) {
    this.adjuntos.splice(index, 1);
  }
}
