import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import icDocument from "@iconify/icons-ic/attach-file";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { TicketsService } from "../../../tickets.service";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import icFile from "@iconify/icons-ic/file-download";
import icDelete from "@iconify/icons-ic/delete";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import Swal from "sweetalert2";
import { PostAdjunto } from "src/app/model/models";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"],
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class DocumentosComponent implements OnInit {
  @Input() adjuntos?: any[] = [];
  @Input() idTicket?: number;
  icDocument = icDocument;
  icPdf = icPdf;
  icFile = icFile;
  icDelete = icDelete;
  documento;
  nombreArchivo: string;
  tamanioArchivo: string;
  fileBase64: string;
  adjunto: boolean;
  mostrarAdjuntos = false;
  @Output() emitirDocumento = new EventEmitter<boolean>();

  constructor(
    private spinner: NgxSpinnerService,
    private ticketService: TicketsService,
    private dataService: DataService,
    private componentes: ComponentesService
  ) {}

  ngOnInit(): void {
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
        idTicket: this.idTicket,
        tipoAdjunto: TiposAdjunto.Documento,
        observaciones: this.nombreArchivo,
      };
      this.ticketService.postNewTicketAdjunto(adjuntoEnviar).subscribe(
        (res: any) => {
          this.emitirDocumento.emit(true);
        },
        (error) => {
          this.componentes.alerta("error", error);
        }
      );
    });
  }

  verAdjunto(url) {
    //descargar adjunto
    window.open(url, "_blank");

    /*   this.spinner.show();
    this.ticketService
      .getTicketAdjuntosByIdAdjunto(item.idAdjunto, this.idTicket)
      .subscribe(
        (res) => {
          this.documento = URL.createObjectURL(res);
          this.spinner.hide();
          window.open(this.documento, "_blank");
        },
        (error) => {
          this.componentes.alerta(
            "error",
            "Ocurrio un error al descargar del adjunto"
          );
          this.spinner.hide();
        }
      ); */
  }

  eliminarAdjunto(adjunto) {
    Swal.fire({
      icon: "warning",
      title: "Desea eliminar el archivo " + adjunto.name + " de este ticket?",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      cancelButtonColor: "red",
    }).then((res) => {
      if (res.isConfirmed) {
        //this.adjuntos.splice(index); //Elimina visualmente el adjunto
        this.ticketService.deleteAdjuntoTicket(adjunto.idAdjunto).subscribe(
          (res) => {
            this.componentes.alerta(
              "success",
              "Adjunto del ticket borrado correctamente"
            );
            this.emitirDocumento.emit(true);
          },
          (error) => {
            //this.componentes.alerta("error", error.error.title);
            console.log("ERROR = ", error);
          }
        );
      }
    });
  }
}
