import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { TicketsService } from "../../tickets.service";
import icDriveFile from "@iconify/icons-ic/insert-drive-file";
import icRemoveCircle from "@iconify/icons-ic/remove-circle";
import icDelete from "@iconify/icons-ic/delete";
import icClose from "@iconify/icons-ic/twotone-close";

//ICONOS
import icDocument from "@iconify/icons-ic/file-upload";
import { FormControl } from "@angular/forms";

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import icAttachFile from "@iconify/icons-ic/twotone-attach-file";
import { LocalService } from "src/app/services/local.service";
import { PostAdjunto } from "src/app/model/models";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-comentar-ticket",
  templateUrl: "./comentar-ticket.component.html",
  styleUrls: ["./comentar-ticket.component.scss"],
})
export class ComentarTicketComponent implements OnInit {
  icAttachFile = icAttachFile;
  comentario;
  dataTarea;
  dataTicket;
  adjunto;
  nombreArchivo: string;
  fileBase64: string;
  mostrarAdjuntos = false;
  adjuntos: PostAdjunto[] = [];
  fileToUpload;
  showMencioados = false;
  empleados = [];
  mencionados = [];
  //items: string[] = [];
  items: string[] = [];

  //ICONOS
  icDocument = icDocument;
  icDriveFile = icDriveFile;
  icRemoveCircle = icRemoveCircle;
  icDelete = icDelete;
  icClose = icClose;

  myControlPagador = new FormControl();
  isLoading = false;
  errorMsg!: string;

  @Output() itemSelected: EventEmitter<any>;
  @Output() reloadComentarios: EventEmitter<any>;

  constructor(
    public dialogRef: MatDialogRef<ComentarTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceTicket: TicketsService,
    private dataComponent: ComponentesService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private localServiceS: LocalService
  ) {}

  ngOnInit() {
    this.dataTarea = this.data["dataTarea"];
    this.dataTicket = this.data["dataTicket"];

    this.serviceTicket.getEmpleados("").subscribe((empleados: any) => {
      this.empleados = empleados.result;
      this.items = this.empleados;
      // this.empleados.forEach((empleado: any) => {
      //   this.items.push(empleado.nombre.toLowerCase());
      // } );
      // console.log(this.items);
    });

    //Pagador
    this.myControlPagador.valueChanges
      .pipe(
        filter((res) => {
          return res !== null;
        }),
        distinctUntilChanged(),
        tap(() => {
          this.errorMsg = "";
          this.empleados = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.serviceTicket.getEmpleados(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((res: any) => {
        if (res.result == undefined) {
          this.errorMsg = res.message;
          this.empleados = [];
        } else {
          this.errorMsg = "";
          this.empleados = res.result;
        }
      });
  }

  removeAdjunto(index) {
    this.adjuntos.splice(index, 1);
  }

  // ADJUNTOS
  async handleFileInput(files: FileList, event?) {
    this.fileToUpload = files.item(0);
    const file = (event.target as HTMLInputElement).files[0];
    this.nombreArchivo = file.name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.fileBase64 = res;
        this.mostrarAdjuntos = true;
        this.adjunto = true;
        const data: PostAdjunto = {
          adjunto: this.fileBase64,
          name: file.name,
          mimeType: file.type,

          size: file.size,
          tipoAdjunto: TiposAdjunto.Documento,
        };
        this.adjuntos.push(data);
      },
      (error) => {}
    );
  }

  crearComentario() {
    this.spinner.show();
    const idUsuario = this.localServiceS.getItem("id");
    const usuario = this.localServiceS.getItem("nombre");
    this.serviceTicket
      .postTareaComentarios(
        this.dataTicket["idTarea"],
        idUsuario,
        usuario,
        this.comentario,
        this.mencionados
      )
      .subscribe(
        (response) => {
          if (response["success"] == true) {
            this.dialogRef.close(true);
            if (this.adjuntos.length > 0) {
              this.adjuntos.forEach((adjunto) => {
                adjunto.idComentario = response["result"]["idComentario"];

                this.serviceTicket.postNewTicketAdjunto(adjunto).subscribe(
                  (response) => {},
                  (error) => {
                    this.dataComponent.errorHandler(error);
                    this.spinner.hide();
                  }
                );
              });
            }

            this.dataComponent
              .alerta("success", "Comentario agregado correctamente")
              .then((res) => {
                if (res.isConfirmed) {
                  this.dialogRef.close();
                }
              });
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.dataComponent.alerta("error", response["message"]);
          }
        },
        (error) => {
          this.spinner.hide();
          this.dataComponent.errorHandler(error);
        }
      );
  }

  mentionSelect() {
  }

  closed(item) {
    this.mencionados.push(item);
  }

  eventHandler(event: any) {
    if (this.showMencioados == true) {
      const term = event.target.value.search("@");
      const term2 = event.target.value.slice(term + 1);
    }
    if (event.key == "@") {
      this.showMencioados = true;
    }
    if (event.key == " ") {
      this.showMencioados = false;
    }
  }

  mencionar(event) {
    this.showMencioados = false;
    // this.mencionados.push(event);
    const existe = this.mencionados.findIndex(
      (x) => x.idEntidad == event.idEntidad
    );
    if (existe == -1) {
      this.mencionados.push(event);
    }
  }

  eliminarMencionado(idEntidad) {
    const eliminar = this.mencionados.findIndex(
      (x) => x.idEntidad == idEntidad
    );
    this.mencionados.splice(eliminar, 1);
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
